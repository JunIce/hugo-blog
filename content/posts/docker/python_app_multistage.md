---
title: "docker python应用多步打包镜像"
date: 2023-08-28T09:56:39+08:00
draft: true
---

# docker python应用多步打包镜像

```dockerfile
FROM python:3.9-slim as compiler
ENV PYTHONUNBUFFERED 1

WORKDIR /app/

RUN python -m venv /opt/venv
# Enable venv
ENV PATH="/opt/venv/bin:$PATH"

COPY ./requirements.txt /app/requirements.txt
RUN pip install -Ur requirements.txt

FROM python:3.9-slim as runner
WORKDIR /app/
COPY --from=compiler /opt/venv /opt/venv

# Enable venv
ENV PATH="/opt/venv/bin:$PATH"
COPY . /app/
CMD ["python", "app.py", ]
```


## Reference
[https://pythonspeed.com/articles/activate-virtualenv-dockerfile/](https://pythonspeed.com/articles/activate-virtualenv-dockerfile/)
[https://pythonspeed.com/articles/multi-stage-docker-python/](https://pythonspeed.com/articles/multi-stage-docker-python/)
[https://stackoverflow.com/questions/48561981/activate-python-virtualenv-in-dockerfile](https://stackoverflow.com/questions/48561981/activate-python-virtualenv-in-dockerfile)

