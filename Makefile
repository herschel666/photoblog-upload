# Bring in the `source`-command
SHELL := /bin/bash

.venv/bin/activate:
	python3 -m venv ./.venv
	pip install --upgrade pip

.venv/bin/sam: .venv/bin/activate
	source ./.venv/bin/activate
	pip install aws-sam-cli
