from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__truncate_error=False  # Tell passlib to truncate instead of crashing
)


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password using bcrypt. Truncate to 72 characters."""
    try:
        truncated = plain_password[:72]
        return pwd_context.hash(truncated)
    except Exception as e:
        raise Exception(f"Bcrypt Error (len={len(plain_password)}): {str(e)}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password[:72], hashed_password)
