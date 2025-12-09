import os
import pytest
import sqlite3
import sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, ROOT)
from src.services.database_service import DatabaseService


@pytest.fixture
def temp_db(monkeypatch, tmp_path):
    test_db = tmp_path / "test_db"
    
    monkeypatch.setattr(
        "src.services.database_service.DB_PATH",
        str(test_db)
    )

    return DatabaseService()