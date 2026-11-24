import bcrypt
from werkzeug.security import generate_password_hash, check_password_hash


def hash_password(password: str) -> str:
    """Hash password using Werkzeug's default secure method."""
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against bcrypt ($2a$, $2b$, $2y$) or Werkzeug hashes."""
    if not password or not password_hash:
        return False

    # Check if hash is a bcrypt hash (e.g. from seed.sql or external migration)
    if password_hash.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(
                password.encode("utf-8"),
                password_hash.encode("utf-8")
            )
        except Exception:
            return False

    # Otherwise verify using Werkzeug (scrypt, pbkdf2, etc.)
    try:
        return check_password_hash(password_hash, password)
    except Exception:
        return False
