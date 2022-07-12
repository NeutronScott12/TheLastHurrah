FROM golang:1.17.2-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go build -o ./dist

EXPOSE 7070

CMD [ "/dist" ]