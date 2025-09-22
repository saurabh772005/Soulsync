from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Initialize SQLAlchemy instance
db = SQLAlchemy()

# ---------------------------
# User Model
# ---------------------------
class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    # Relationships
    mood_entries = db.relationship("MoodEntry", backref="user", lazy=True)
    community_posts = db.relationship("CommunityPost", backref="user", lazy=True)
    chat_participations = db.relationship('ChatParticipant', backref='user', lazy=True)

    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check the password hash"""
        return check_password_hash(self.password_hash, password)


# ---------------------------
# MoodEntry Model
# ---------------------------
class MoodEntry(db.Model):
    __tablename__ = 'mood_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mood_emoji = db.Column(db.String(10), nullable=False)
    mood_label = db.Column(db.String(50), nullable=False)
    intensity = db.Column(db.Integer, nullable=False)
    triggers = db.Column(db.Text)
    journal_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Community Models
# ---------------------------
class CommunityPost(db.Model):
    __tablename__ = 'community_posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    emotion_tag = db.Column(db.String(50))
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Achievement Model
# ---------------------------
class Achievement(db.Model):
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Support Group Models
# ---------------------------
class SupportGroup(db.Model):
    __tablename__ = 'support_groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Chat Models
# ---------------------------
class ChatRoom(db.Model):
    __tablename__ = 'chat_rooms'

    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(100))
    is_group = db.Column(db.Boolean, default=False)
    messages = db.relationship('ChatMessage', backref='room', lazy=True)
    participants = db.relationship('ChatParticipant', backref='room', lazy=True)


class ChatParticipant(db.Model):
    __tablename__ = 'chat_participants'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_rooms.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_identity_revealed = db.Column(db.Boolean, default=False)


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_rooms.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.Text)
    is_anonymous = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Matching System
# ---------------------------
class MatchPreference(db.Model):
    __tablename__ = 'match_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    preferences = db.Column(db.Text)  # JSON string of preference tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='match_preference', uselist=False)

    @classmethod
    def find_matches(cls, user_id):
        my_pref = cls.query.filter_by(user_id=user_id).first()
        if not my_pref:
            return []
        return cls.query.filter(
            cls.user_id != user_id,
            cls.preferences.contains("anxiety")  # example filter
        ).all()

