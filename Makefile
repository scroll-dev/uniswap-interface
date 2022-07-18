.PHONY: docker

docker:
	docker compose -f docker-compose.yml build
