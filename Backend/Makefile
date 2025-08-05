.PHONY: build run clean restore update-db migrations remove-migrations drop-db

# Variáveis do Projeto
PROJECT_NAME = Backend.csproj
MIGRATIONS_PROJECT = Backend

# Comando para restaurar os pacotes NuGet do projeto.
restore:
	dotnet restore

# Comando para construir o projeto.
build:
	dotnet build

# Comando para executar a aplicação.
run:
	dotnet run --project $(PROJECT_NAME)

# Comando para limpar os artefatos de compilação.
clean:
	dotnet clean

# Adiciona uma nova migração. O nome deve ser fornecido.
# Exemplo: make migrations NAME="AdicionaTabelaDeUsuarios"
migrations:
	@if [ -z "$(NAME)" ]; then \
		echo "ERRO: O nome da migração deve ser fornecido. Use 'make migrations NAME=\"NomeDaSuaMigracao\"'"; \
		exit 1; \
	fi
	dotnet ef migrations add $(NAME) --project $(MIGRATIONS_PROJECT)

# Atualiza a base de dados aplicando as migrações pendentes.
update-db:
	dotnet ef database update --project $(MIGRATIONS_PROJECT)

# Remove a última migração.
remove-migrations:
	dotnet ef migrations remove --project $(MIGRATIONS_PROJECT)

# Deleta a base de dados.
drop-db:
	dotnet ef database drop --project $(MIGRATIONS_PROJECT) -f
