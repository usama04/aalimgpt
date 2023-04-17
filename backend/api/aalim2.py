from dotenv import load_dotenv
from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent, AgentOutputParser
from langchain.prompts import BaseChatPromptTemplate
from langchain import SerpAPIWrapper, LLMChain
from langchain.chat_models import ChatOpenAI
from typing import List, Union
from langchain.schema import AgentAction, AgentFinish, HumanMessage
from langchain.memory import ConversationBufferWindowMemory
import re

load_dotenv(dotenv_path="../.env")

# Set up tools

search = SerpAPIWrapper()

tools = [
    Tool(
        name="search",
        func=search.run,
        description="Searches the web for Islamic websites to answer queries",
    ),
]

# Set up the base template
# Add this to the template for memory
# Previous conversation history:
# {history}

template = """"You are a well versed Islamic Scholar. Answer the following questions as best as you can in accordance with Quran and Sunnah. You have access to the following tools:

{tools}

Use the following format:
Question: the input question you must answer
Thought: You should always think about what to do
Action: the action you take should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: A verbose final answer to the original input question which also contains Quran and Sunnah references

Begin! Remember to be as authentic as possible as you are an Islamic Scholar! Final Answer MUST be verbose and MUST include Quran and Sunnah references.

Questioner: {input}
{agent_scratchpad}
"""

# Setup template prompt

class CustomPromptTemplate(BaseChatPromptTemplate):
    # The template to use:
    template: str
    
    tools: List[Tool]
    
    def format_messages(self, **kwargs) -> str:
        # Get the intermediate steps (AgentAction, Observation tuples)
        # Format them in a particular way
        intermediate_steps = kwargs.pop("intermediate_steps")
        thoughts = ""
        for action, observation in intermediate_steps:
            thoughts += action.log
            thoughts += f"\nObservation: {observation}\nThought: "
        # Set the agent scratchpad variable to that value
        kwargs["agent_scratchpad"] = thoughts
        # Create a tools variable from the tools list
        kwargs["tools"] = "\n".join([f"{tool.name}: {tool.description}" for tool in self.tools])
        # Create a tool_names variable from the tools list
        kwargs["tool_names"] = ", ".join([tool.name for tool in self.tools])
        #kwargs["history"] = kwargs["history"].replace("\n", "\n\t")
        formatted = self.template.format(**kwargs)
        return [HumanMessage(content=formatted)]
    
custom_prompt = CustomPromptTemplate(
    template=template,
    tools=tools,
    # This omits the `agent_scratchpad`, `tools`, and `tool_names` variables because those are generated dynamically
    # This includes the `intermediate_steps` variable because that is needed
    #input_variables=["input", "intermediate_steps", "history"], # Use when with history
    input_variables=["input", "intermediate_steps"],
)

# Output parser

class CustomOutputParser(AgentOutputParser):
    
    def parse(self, llm_output: str) -> Union[AgentAction, AgentFinish]:
        # Check if Agent should finish
        if "Final Answer:" in llm_output:
            return AgentFinish(
                return_values={"output": llm_output.split("Final Answer:")[-1].strip()},
                log=llm_output
            )
        # Parse out the action and action input
        regex = r"Action: (.*?)[\n]*Action Input:[\s]*(.*)"
        match = re.search(regex, llm_output, re.DOTALL)
        if not match:
            # raise ValueError(f"Could not parse LLM output: `{llm_output}`")
            return AgentFinish(
                return_values={"output": llm_output},
                log=llm_output
            )
        action = match.group(1).strip()
        action_input = match.group(2)
        # return action and action input
        return AgentAction(
            tool=action,
            tool_input=action_input.strip(" ").strip('"'),
            log=llm_output
        )

output_parser = CustomOutputParser()

# Setup LLM
llm = ChatOpenAI(temperature=0)

# LLM chain consisting of the LLM and a prompt
llm_chain = LLMChain(llm=llm, prompt=custom_prompt)

tool_names = [tool.name for tool in tools]
agent = LLMSingleActionAgent(
    llm_chain=llm_chain, 
    output_parser=output_parser,
    stop=["\nObservation:"], 
    allowed_tools=tool_names
)

#memory=ConversationBufferWindowMemory(k=2)

agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, 
                                                    tools=tools, 
                                                    verbose=True, 
                                                    #memory=memory
                                                    )