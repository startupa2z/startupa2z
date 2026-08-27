import unittest
from unittest.mock import AsyncMock

from all_users import upsert_all_user
from routers.all_users import _column_map


class AllUsersImportTests(unittest.IsolatedAsyncioTestCase):
    def test_luma_linkedin_header_is_preserved(self):
        columns = _column_map([
            "email",
            "name",
            "What is your LinkedIn profile?",
        ])

        self.assertEqual(columns["linkedin_url"], "What is your LinkedIn profile?")

    async def test_upsert_passes_linkedin_url_to_database(self):
        db = AsyncMock()

        await upsert_all_user(
            db,
            email="Founder@Example.com",
            source="luma_csv",
            full_name="Example Founder",
            linkedin_url="https://www.linkedin.com/in/example-founder/",
        )

        args = db.execute.await_args.args
        self.assertIn("linkedin_url", args[0])
        self.assertEqual(args[9], "https://www.linkedin.com/in/example-founder/")
        self.assertEqual(args[-1], "luma_csv")


if __name__ == "__main__":
    unittest.main()
