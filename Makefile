# Bring in the `source`-command
SHELL := /bin/bash
AWS_REGION = eu-central-1
ENV_FLAG ?= ""
ENV ?= Staging

.PHONY: deploy-prod
deploy-prod: ENV_FLAG=--production
deploy-prod: deploy

.PHONY: delete-prod
delete-prod: ENV=Production
delete-prod: delete

.PHONY: mb
mb: .venv/bin/aws activate guard-AWS_ACCESS_KEY_ID guard-AWS_SECRET_ACCESS_KEY guard-DEPLOY_BUCKET_URL
	@ AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		aws --region $(AWS_REGION) s3 mb $(DEPLOY_BUCKET_URL)

.PHONY: deploy
deploy: .venv/bin/aws activate guard-TLD guard-HOSTED_ZONE_ID guard-CERTIFICATE_ARN
	@ cd server && \
		TLD=$(TLD) \
		HOSTED_ZONE_ID=$(HOSTED_ZONE_ID) \
		CERTIFICATE_ARN=$(CERTIFICATE_ARN) \
		npx arc deploy $(ENV_FLAG)

.PHONY: delete
delete: .venv/bin/aws activate guard-AWS_ACCESS_KEY_ID guard-AWS_SECRET_ACCESS_KEY
	@ AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
		AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
		aws cloudformation delete-stack \
		--stack-name PhotoblogUploadServer$(ENV) \
		--region $(AWS_REGION)

.venv/bin/activate:
	python3 -m venv ./.venv
	pip install --upgrade pip

.venv/bin/aws: .venv/bin/activate
	@ pip install awscli

.PHONY: activate
activate:
	@ source ./.venv/bin/activate

.PHONY: guard-%
guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi
