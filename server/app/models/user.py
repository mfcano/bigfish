from firebase_admin import firestore
from datetime import datetime

class User:
    collection_name = 'users'

    def __init__(self, uid, email=None, display_name=None, photo_url=None, theme='dark', mvp_layout='left'):
        self.uid = uid
        self.email = email
        self.display_name = display_name
        self.photo_url = photo_url
        self.theme = theme
        self.mvp_layout = mvp_layout
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            'email': self.email,
            'display_name': self.display_name,
            'photo_url': self.photo_url,
            'theme': self.theme,
            'mvp_layout': self.mvp_layout,
            'updated_at': self.updated_at
        }

    @staticmethod
    def from_dict(uid, source):
        return User(
            uid=uid,
            email=source.get('email'),
            display_name=source.get('display_name'),
            photo_url=source.get('photo_url'),
            theme=source.get('theme', 'dark'),
            mvp_layout=source.get('mvp_layout', 'left')
        )

