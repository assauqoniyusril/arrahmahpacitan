FROM golang:1.24-alpine AS builder
WORKDIR /src
RUN apk add --no-cache ca-certificates git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/reportase-api ./cmd/api

FROM alpine:3.21
RUN apk add --no-cache ca-certificates tzdata wget && addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=builder /out/reportase-api /app/reportase-api
RUN mkdir -p /app/uploads && chown -R app:app /app
USER app
EXPOSE 8005
CMD ["/app/reportase-api"]
