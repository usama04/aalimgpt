import datetime as dt
import sqlalchemy as sa
import sqlalchemy.orm as orm
import passlib.hash as ph
import databases.database as db

class User(db.Base):
    __tablename__ = 'users'
    id = sa.Column(sa.Integer, primary_key=True)
    first_name = sa.Column(sa.String(50), nullable=True)
    last_name = sa.Column(sa.String(50), nullable=True)
    email = sa.Column(sa.String(50), nullable=False, unique=True)
    hashed_password = sa.Column(sa.String(100), nullable=False)
    profile = orm.relationship('Profile', back_populates='user')
    
    def verify_password(self, password):
        return ph.bcrypt.verify(password, self.hashed_password)
    
    def set_password(self, password):
        self.hashed_password = ph.bcrypt.hash(password)
        
    def __repr__(self):
        return f'User: {self.first_name} {self.last_name}; Email: {self.email}'
    
    def __str__(self):
        return f'{self.first_name} {self.last_name} {self.email}'

    
    
class Profile(db.Base):
    __tablename__ = 'profiles'
    id = sa.Column(sa.Integer, primary_key=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey('users.id'))
    user = orm.relationship('User', back_populates='profile')
    bio = sa.Column(sa.String(1000), nullable=True)
    location = sa.Column(sa.String(100), nullable=True)
    birth_date = sa.Column(sa.Date, nullable=True)
    created_at = sa.Column(sa.DateTime, default=dt.datetime.now)
    updated_at = sa.Column(sa.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    profile_image = sa.Column(sa.String(100), nullable=True)
    
    def __repr__(self):
        return f'Profile: {self.user.first_name} {self.user.last_name}; Bio: {self.bio}'
    
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name} {self.bio}'
    
