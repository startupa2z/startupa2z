from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/startupa2z"
    jwt_secret: str = "change_this_to_a_long_random_secret"

    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_user: str = ""
    smtp_pass: str = ""
    smtp_from: str = "noreply@startupa2z.org"

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    port: int = 3001

    linkedin_client_id: str = ""
    linkedin_client_secret: str = ""
    linkedin_redirect_uri: str = ""


settings = Settings()
