
"""
Database initialization script for SoulSync application.
Run this script to set up the database with initial data.
"""

from app import app, db
from models import User, Achievement, SupportGroup, CommunityPost, MoodEntry
from datetime import datetime, timedelta
import random

def create_sample_users():
    """Create sample users for testing"""
    sample_users = [
        {
            'username': 'testuser1',
            'email': 'test1@example.com',
            'password': 'password123',
            'full_name': 'John Doe'
        },
        {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'password123',
            'full_name': 'Jane Smith'
        }
    ]
    
    for user_data in sample_users:
        if not User.query.filter_by(email=user_data['email']).first():
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                full_name=user_data['full_name']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
            print(f"Created user: {user_data['full_name']}")

def create_sample_mood_entries():
    """Create sample mood entries for testing"""
    users = User.query.all()
    if not users:
        return
    
    moods = [
        {'emoji': '😊', 'label': 'Happy', 'intensity': 4},
        {'emoji': '😐', 'label': 'Neutral', 'intensity': 3},
        {'emoji': '😔', 'label': 'Sad', 'intensity': 2},
        {'emoji': '😢', 'label': 'Very Sad', 'intensity': 1},
        {'emoji': '😡', 'label': 'Angry', 'intensity': 3},
        {'emoji': '😴', 'label': 'Tired', 'intensity': 2}
    ]
    
    triggers_options = [
        '["work", "stress"]',
        '["relationships", "family"]',
        '["health", "sleep"]',
        '["studies", "pressure"]',
        '["social", "friends"]'
    ]
    
    journal_texts = [
        "Had a great day today! Everything went smoothly at work.",
        "Feeling a bit overwhelmed with all the tasks I need to complete.",
        "Spent quality time with family. It was really refreshing.",
        "Didn't sleep well last night. Feeling tired and low on energy.",
        "Stressed about upcoming deadlines but trying to stay positive."
    ]
    
    for user in users:
        for i in range(7):
            date = datetime.utcnow() - timedelta(days=i)
            mood = random.choice(moods)
            
            mood_entry = MoodEntry(
                user_id=user.id,
                mood_emoji=mood['emoji'],
                mood_label=mood['label'],
                intensity=mood['intensity'],
                triggers=random.choice(triggers_options),
                journal_text=random.choice(journal_texts),
                created_at=date
            )
            db.session.add(mood_entry)
    
    print("Created sample mood entries")

def create_sample_posts():
    """Create sample community posts"""
    users = User.query.all()
    if not users:
        return
    
    sample_posts = [
        {
            'content': "Just wanted to share that meditation really helped me today. 10 minutes of deep breathing made such a difference!",
            'emotion_tag': 'calm'
        },
        {
            'content': "Having a tough day with anxiety. Any tips for managing racing thoughts?",
            'emotion_tag': 'anxious'
        },
        {
            'content': "Completed my first week of mood tracking! Small steps but feeling proud of myself.",
            'emotion_tag': 'happy'
        },
        {
            'content': "Remember: it's okay to have bad days. Tomorrow is a new opportunity. You're not alone in this journey. 💙",
            'emotion_tag': 'hopeful'
        },
        {
            'content': "Does anyone else find journaling helpful? I've been writing for a week now and it's becoming therapeutic.",
            'emotion_tag': 'general'
        }
    ]
    
    for i, post_data in enumerate(sample_posts):
        user = users[i % len(users)]
        post = CommunityPost(
            user_id=user.id,
            content=post_data['content'],
            emotion_tag=post_data['emotion_tag'],
            is_anonymous=True,
            created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48))
        )
        db.session.add(post)
    
    print("Created sample community posts")

def main():
    """Main initialization function"""
    print("Initializing SoulSync database...")
    
    with app.app_context():
        print("Creating database tables...")
        db.drop_all()
        db.create_all()
        
        create_sample_users()
        create_sample_mood_entries()
        create_sample_posts()
        
        try:
            db.session.commit()
            print("✅ Database initialization completed successfully!")
            print("\nSample login credentials:")
            print("Email: test1@example.com | Password: password123")
            print("Email: test2@example.com | Password: password123")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error during database initialization: {e}")

if __name__ == '__main__':
    main()
