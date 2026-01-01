# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agora is an ML-powered investment platform built on a microservices architecture. The system handles market data ingestion, technical analysis, portfolio management, and generates ML-driven investment recommendations.

**Current Phase:** Infrastructure setup complete; application development in progress.

**Architecture:** Multi-repository microservices - each service has its own Git repository with independent Docker Compose setup.

**Current Workspace Repositories:**
- `/home/beltas/` - Main workspace (this directory)
- `Agora_SQL/` - Database schemas, migrations, and SQL code (separate Git repo)
- `Agora_Documentation/` - Architecture docs, design specs, and planning (separate Git repo)

**Trading Platform Repositories (to be created):**

*Infrastructure Repositories:*
- `trading_platform-infrastructure/` - Core databases (TimescaleDB, PostgreSQL, Redis)
- `trading_platform-kafka/` - Kafka cluster with Zookeeper, UI, Schema Registry
- `trading_platform-rabbitmq/` - RabbitMQ cluster with Management UI
- `trading_platform-monitoring/` - Prometheus, Grafana, Jaeger, Loki
- `trading_platform-api-gateway/` - Kong/Traefik API Gateway
- `trading_platform-mlflow/` - MLflow tracking server for ML models

*Microservice Repositories:*
- `trading_platform-market-data/` - Python (FastAPI) - Market data ingestion
- `trading_platform-analysis-engine/` - Python (FastAPI + ML) - Technical analysis & predictions
- `trading_platform-portfolio-manager/` - C++23 - Portfolio & transaction management
- `trading_platform-recommendation-engine/` - Python (FastAPI) - Investment recommendations
- `trading_platform-notification-service/` - Node.js (NestJS) - Email & push notifications
- `trading_platform-timeseries-analysis/` - Python (FastAPI + statsmodels) - Time series analysis & pattern detection

*Orchestration:*
- `trading_platform-orchestration/` - Master documentation, startup scripts, architecture diagrams

**Shared Docker Network:** `trading_platform_network` - All services connect to this for inter-service communication

## Database Setup

The project uses TimescaleDB (PostgreSQL 16 with time-series extensions) running in Docker.

### Database Commands

**Start the database:**
```bash
docker-compose up -d
```

**Stop the database:**
```bash
docker-compose down
```

**Access database shell:**
```bash
docker exec -it timescaledb psql -U agora -d AgoraX
```

**Database Configuration:**

Database credentials are stored in environment variables for security:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your credentials:**
   - The `.env` file is gitignored and will NOT be committed
   - Default credentials are already set for local development
   - For production, use strong passwords and secrets management (Kubernetes Secrets, HashiCorp Vault, AWS Secrets Manager)

3. **Connection details (from `.env`):**
   - Host: `localhost:5432`
   - Database: `$POSTGRES_DB` (default: `AgoraX`)
   - User: `$POSTGRES_USER` (default: `agora`)
   - Password: `$POSTGRES_PASSWORD` (see `.env` file)

4. **Database URL:**
   ```
   postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}
   ```

**Security Notes:**
- NEVER commit `.env` to version control (it's in `.gitignore`)
- Use `.env.example` as a template for new developers
- Rotate database passwords regularly in production
- Use managed secrets services in production environments

## Architecture

The system follows a domain-driven microservices architecture with a **polyglot approach** - using the best language for each service's requirements.

### 1. Market Data Service
- Downloads daily EOD prices from data providers
- Stores OHLCV data in TimescaleDB hypertables
- Provides historical price data via REST API
- **Technology:** Python (FastAPI) + TimescaleDB + Redis cache
- **Why Python:** Excellent data processing libraries, fast development

### 2. Analysis Engine Service
- Calculates technical indicators (RSI, MACD, Bollinger Bands)
- Runs time series models (ARIMA, Prophet) and ML models (XGBoost, LSTM)
- Generates price predictions with confidence intervals
- **Technology:** Python (FastAPI) + scikit-learn/TensorFlow + MLflow + PostgreSQL
- **Why Python:** Required for ML/data science ecosystem (non-negotiable)

### 2.5 Time Series Analysis Service (NEW)
- Performs advanced time series analysis on market data
- Pattern detection (head-and-shoulders, double top/bottom, triangles)
- Trend analysis with support/resistance levels
- Volatility modeling (GARCH, realized volatility)
- Regime detection (bull, bear, sideways using HMM)
- Seasonality analysis and change point detection
- **Technology:** Python (FastAPI) + statsmodels + arch + hmmlearn + gRPC
- **Why Python:** Superior time series libraries (statsmodels, arch for GARCH)
- **gRPC Port:** 50056 | **REST Port:** 8006
- **Design Document:** `Agora_Documentation/timeseries-analysis-service-design.md`

### 3. Portfolio Manager Service
- Tracks portfolio holdings, positions, and transactions
- Calculates portfolio metrics (returns, Sharpe ratio, etc.)
- Handles high-throughput transaction processing
- **Technology:** C++23 + gRPC + PostgreSQL (libpqxx) + Redis (redis-plus-plus)
- **Why C++:** Ultra-low latency, high throughput, deterministic performance, no GC pauses
- **Modern C++ Features:** std::expected for error handling, ranges, concepts, structured bindings
- **Frameworks:** Pistache/Drogon for REST, gRPC native support, Boost libraries
- **Build System:** CMake, Conan for dependencies

### 4. Recommendation Engine Service
- Generates buy/sell signals based on analysis and portfolio state
- Performs stock screening and ranking
- Provides position sizing recommendations
- **Technology:** Python (FastAPI) + PostgreSQL + RabbitMQ
- **Why Python:** Complex algorithmic logic, integration with Analysis Engine

### 5. API Gateway
- Single entry point for all client requests
- Handles authentication, authorization, and rate limiting
- **Technology:** Kong / AWS API Gateway / Traefik
- **Why:** Battle-tested, configuration-based (not custom code)

### 6. Notification Service
- Sends email alerts and push notifications
- Handles high-volume async I/O
- **Technology:** Node.js (NestJS) + RabbitMQ + SendGrid/AWS SES
- **Why Node.js:** Excellent async I/O, low memory footprint, fast event processing

## Data Layer

### TimescaleDB (Time-Series Data)
- Primary table: `stock_prices` (hypertable)
- Stores OHLCV data with automatic partitioning by time
- Used by: Market Data Service (write), all other services (read)
- Retention: 2 years with compression after 30 days

### PostgreSQL (Relational Data)
- Tables: `users`, `portfolios`, `positions`, `transactions`, `predictions`, `recommendations`
- Used by: Portfolio Manager, Analysis Engine, Recommendation Engine
- Includes support for multi-asset securities, corporate actions, encrypted brokerage credentials

### Redis (Caching & Queuing)
- Cache keys: `price:{symbol}:latest`, `portfolio:{id}:valuation`, `indicators:{symbol}:{date}`
- TTL-based expiration (5 min for prices, 15 min for indicators)
- Used by: All services for performance optimization

### MLflow (Model Management)
- Stores trained ML models, experiment tracking, and artifacts
- Used by: Analysis Engine Service

## Communication Patterns

### External Communication (REST API)
**Client → API Gateway → Services:** All external requests use REST

The API Gateway exposes REST endpoints for external clients:
- `GET /api/v1/prices/{symbol}` → Market Data Service
- `GET /api/v1/portfolios/{id}` → Portfolio Manager Service
- `POST /api/v1/recommendations/generate` → Recommendation Engine Service
- `GET /api/v1/analysis/predictions/{symbol}` → Analysis Engine Service

**Why REST for external API:**
- Wide compatibility with web/mobile clients
- Easy to use and debug
- Standard HTTP tooling
- Self-documenting (OpenAPI/Swagger)

### Internal Communication (gRPC)
**Service ↔ Service:** All internal microservice communication uses gRPC

Internal service-to-service calls use gRPC for better performance:
- Recommendation Engine → Analysis Engine: `GetPredictions(symbol)`
- Recommendation Engine → Portfolio Manager: `GetPortfolioPositions(portfolio_id)`
- Portfolio Manager → Market Data: `GetPricesBatch(symbols[])`
- Analysis Engine → Market Data: `GetHistoricalPrices(symbol, start_date, end_date)`

**Why gRPC for internal communication:**
- Higher performance (Protocol Buffers binary format)
- Type-safe contracts (protobuf definitions)
- Built-in code generation for multiple languages
- Bi-directional streaming support
- Smaller payload sizes compared to JSON

**Example protobuf definition:**
```protobuf
service MarketDataService {
  rpc GetLatestPrice(PriceRequest) returns (PriceResponse);
  rpc GetPricesBatch(BatchPriceRequest) returns (stream PriceResponse);
  rpc GetHistoricalPrices(HistoricalRequest) returns (stream PriceResponse);
}

message PriceRequest {
  string symbol = 1;
}

message PriceResponse {
  string symbol = 1;
  double close = 2;
  int64 volume = 3;
  google.protobuf.Timestamp time = 4;
}
```

### Asynchronous (Event-Driven)
Services publish events to message queue (RabbitMQ/Kafka) for non-blocking workflows:
- `market_data.ingested` → triggers Analysis Engine
- `prediction.generated` → triggers Recommendation Engine
- `recommendation.created` → triggers Notification Service

**Why message queues:**
- Decoupling services
- Handling background jobs
- Event sourcing and audit trails
- Buffering during traffic spikes

### Communication Summary

| Communication Type | Protocol | Use Case | Example |
|-------------------|----------|----------|---------|
| Client → Platform | REST | External API requests | Web/mobile app calls |
| Service → Service | gRPC | Internal sync calls | Recommendation Engine gets predictions |
| Service → Service | RabbitMQ/Kafka | Internal async events | Market data ingestion triggers analysis |

## TimescaleDB-Specific Patterns

When working with time-series data:

**Use hypertables for time-series data:**
```sql
CREATE TABLE stock_prices (
    time TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    open NUMERIC(10,2),
    high NUMERIC(10,2),
    low NUMERIC(10,2),
    close NUMERIC(10,2),
    volume BIGINT,
    adjusted_close NUMERIC(10,2)
);
SELECT create_hypertable('stock_prices', 'time');
CREATE INDEX idx_symbol_time ON stock_prices (symbol, time DESC);
```

**Use continuous aggregates for pre-computed rollups:**
```sql
CREATE MATERIALIZED VIEW daily_stats
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) as day,
       symbol,
       FIRST(open, time) as open,
       MAX(high) as high,
       MIN(low) as low,
       LAST(close, time) as close
FROM stock_prices
GROUP BY day, symbol;
```

**Apply compression for older data:**
```sql
SELECT add_compression_policy('stock_prices', INTERVAL '30 days');
```

**Set retention policies:**
```sql
SELECT add_retention_policy('stock_prices', INTERVAL '2 years');
```

## Development Workflow

### Working with Multiple Repositories

The workspace uses a **multi-repository architecture** where each microservice and infrastructure component has its own Git repository.

**Current repositories:**
- Main workspace: `/home/beltas/`
- SQL repository: `/home/beltas/Agora_SQL/`
- Documentation repository: `/home/beltas/Agora_Documentation/`

**Trading Platform repositories (to be created in Week 1):**
Each component will be in its own repository with:
- Independent version control
- Own Docker Compose file for local development
- Own CI/CD pipeline
- Own README and documentation

**Repository naming convention:** `trading_platform-<component-name>`

**When making changes:**
- Database schemas/migrations → `Agora_SQL/`
- Design docs, API specs → `Agora_Documentation/`
- Infrastructure setup → `trading_platform-infrastructure/`, `trading_platform-kafka/`, etc.
- Service code → `trading_platform-<service-name>/`

**Multi-repo development workflow:**
1. Start infrastructure: `cd trading_platform-infrastructure && docker-compose up -d`
2. Start message queues: `cd trading_platform-kafka && docker-compose up -d`
3. Start services: Each service in its own terminal/repo
4. All services communicate via shared Docker network: `trading_platform_network`

**Benefits of multi-repo approach:**
- Independent deployments and versioning
- Clear service boundaries
- Team autonomy (different teams own different repos)
- Easier to enforce service isolation
- Smaller, focused repositories

### Vertical Development Approach

The project follows a vertical slice development methodology:
- Develop one complete use case before starting the next
- Each slice includes: API implementation, tests, documentation, and local deployment
- 2-week sprints with Saturday status updates

## C++ Portfolio Manager Service

### Build System & Dependencies

**Build Tools:**
```bash
# CMake (minimum 3.25 for C++23 support)
cmake --version

# Conan (package manager)
pip install conan
```

**Project Structure:**
```
portfolio-manager/
├── CMakeLists.txt
├── conanfile.txt
├── src/
│   ├── main.cpp
│   ├── grpc/
│   │   ├── portfolio_service.cpp
│   │   └── portfolio_service.h
│   ├── db/
│   │   ├── connection_pool.cpp
│   │   └── repository.cpp
│   ├── models/
│   │   ├── portfolio.h
│   │   └── transaction.h
│   └── utils/
├── protos/
│   └── portfolio.proto
├── tests/
│   ├── unit/
│   └── integration/
└── docker/
    └── Dockerfile
```

**CMakeLists.txt:**
```cmake
cmake_minimum_required(VERSION 3.25)
project(PortfolioManager CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Conan integration
include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()

# Find packages
find_package(Protobuf REQUIRED)
find_package(gRPC REQUIRED)
find_package(PostgreSQL REQUIRED)

# Proto files
set(PROTO_FILES protos/portfolio.proto)
protobuf_generate_cpp(PROTO_SRCS PROTO_HDRS ${PROTO_FILES})
grpc_generate_cpp(GRPC_SRCS GRPC_HDRS ${CMAKE_CURRENT_BINARY_DIR} ${PROTO_FILES})

# Build executable
add_executable(portfolio_manager
    src/main.cpp
    src/grpc/portfolio_service.cpp
    src/db/connection_pool.cpp
    ${PROTO_SRCS}
    ${GRPC_SRCS}
)

target_link_libraries(portfolio_manager
    ${CONAN_LIBS}
    gRPC::grpc++
    protobuf::libprotobuf
    pqxx
)
```

**conanfile.txt:**
```ini
[requires]
grpc/1.54.0
protobuf/3.21.9
libpqxx/7.7.5
redis-plus-plus/1.3.7
boost/1.82.0
spdlog/1.11.0
nlohmann_json/3.11.2
catch2/3.3.2

[generators]
cmake
```

### Key C++ Libraries

**Database (PostgreSQL):**
- `libpqxx` - Modern C++ PostgreSQL client
- Connection pooling with custom implementation or `libpqxx::connection_pool`

**Redis:**
- `redis-plus-plus` - Modern Redis C++ client
- Thread-safe connection pooling

**gRPC:**
- Native C++ support (gRPC was originally written in C++)
- Excellent performance with zero-copy optimization

**Logging:**
- `spdlog` - Fast, header-only logging
- Async logging for minimal performance impact

**JSON:**
- `nlohmann/json` - Modern JSON library for C++

**Testing:**
- `Catch2` - Modern C++ test framework
- Google Test/Google Mock (alternative)

**Utilities:**
- `Boost` - Date/time, algorithms, thread pools
- `abseil-cpp` - Google's C++ common libraries

### Example: gRPC Server Implementation

**portfolio.proto:**
```protobuf
syntax = "proto3";

package portfolio;

service PortfolioService {
  rpc GetPortfolio(GetPortfolioRequest) returns (Portfolio);
  rpc GetPositions(GetPositionsRequest) returns (PositionsResponse);
  rpc ExecuteTransaction(TransactionRequest) returns (TransactionResponse);
  rpc GetPortfolioValue(GetPortfolioRequest) returns (ValueResponse);
}

message GetPortfolioRequest {
  string portfolio_id = 1;
}

message Portfolio {
  string id = 1;
  string user_id = 2;
  string name = 3;
  double cash_balance = 4;
  int64 created_at = 5;
}

message Position {
  string symbol = 1;
  double quantity = 2;
  double average_cost = 3;
  double current_price = 4;
  double market_value = 5;
}

message PositionsResponse {
  repeated Position positions = 1;
}
```

**portfolio_service.cpp:**
```cpp
#include <grpcpp/grpcpp.h>
#include <pqxx/pqxx>
#include <spdlog/spdlog.h>
#include "portfolio.grpc.pb.h"

class PortfolioServiceImpl final : public portfolio::PortfolioService::Service {
private:
    std::shared_ptr<ConnectionPool> db_pool_;
    std::shared_ptr<RedisPool> redis_pool_;

public:
    PortfolioServiceImpl(
        std::shared_ptr<ConnectionPool> db_pool,
        std::shared_ptr<RedisPool> redis_pool
    ) : db_pool_(std::move(db_pool)), redis_pool_(std::move(redis_pool)) {}

    grpc::Status GetPortfolio(
        grpc::ServerContext* context,
        const portfolio::GetPortfolioRequest* request,
        portfolio::Portfolio* response
    ) override {
        try {
            // Try cache first
            auto redis_conn = redis_pool_->acquire();
            std::string cache_key = "portfolio:" + request->portfolio_id();

            auto cached = redis_conn->get(cache_key);
            if (cached) {
                // Parse cached JSON and populate response
                return grpc::Status::OK;
            }

            // Cache miss - query database
            auto conn = db_pool_->acquire();
            pqxx::work txn(*conn);

            auto result = txn.exec_params(
                "SELECT id, user_id, name, cash_balance, "
                "EXTRACT(EPOCH FROM created_at) as created_at "
                "FROM portfolios WHERE id = $1",
                request->portfolio_id()
            );

            if (result.empty()) {
                return grpc::Status(
                    grpc::StatusCode::NOT_FOUND,
                    "Portfolio not found"
                );
            }

            auto row = result[0];
            response->set_id(row["id"].as<std::string>());
            response->set_user_id(row["user_id"].as<std::string>());
            response->set_name(row["name"].as<std::string>());
            response->set_cash_balance(row["cash_balance"].as<double>());
            response->set_created_at(row["created_at"].as<int64_t>());

            // Cache the result (5 minutes TTL)
            redis_conn->setex(cache_key, 300, serialize_to_json(*response));

            spdlog::info("Retrieved portfolio: {}", request->portfolio_id());
            return grpc::Status::OK;

        } catch (const std::exception& e) {
            spdlog::error("Error getting portfolio: {}", e.what());
            return grpc::Status(
                grpc::StatusCode::INTERNAL,
                "Internal server error"
            );
        }
    }

    grpc::Status ExecuteTransaction(
        grpc::ServerContext* context,
        const portfolio::TransactionRequest* request,
        portfolio::TransactionResponse* response
    ) override {
        auto conn = db_pool_->acquire();
        pqxx::work txn(*conn);

        try {
            // Insert transaction
            auto result = txn.exec_params(
                "INSERT INTO transactions "
                "(portfolio_id, symbol, transaction_type, quantity, price, net_amount) "
                "VALUES ($1, $2, $3, $4, $5, $6) "
                "RETURNING id",
                request->portfolio_id(),
                request->symbol(),
                request->type(),
                request->quantity(),
                request->price(),
                request->quantity() * request->price()
            );

            // Update position
            txn.exec_params(
                "INSERT INTO positions (portfolio_id, symbol, quantity, average_cost) "
                "VALUES ($1, $2, $3, $4) "
                "ON CONFLICT (portfolio_id, symbol) "
                "DO UPDATE SET quantity = positions.quantity + EXCLUDED.quantity",
                request->portfolio_id(),
                request->symbol(),
                request->quantity(),
                request->price()
            );

            txn.commit();

            response->set_transaction_id(result[0]["id"].as<std::string>());
            response->set_success(true);

            spdlog::info("Transaction executed: {}", response->transaction_id());
            return grpc::Status::OK;

        } catch (const std::exception& e) {
            txn.abort();
            spdlog::error("Transaction failed: {}", e.what());
            return grpc::Status(
                grpc::StatusCode::ABORTED,
                "Transaction failed"
            );
        }
    }
};

void RunServer() {
    std::string server_address("0.0.0.0:50052");

    auto db_pool = std::make_shared<ConnectionPool>(
        std::getenv("DATABASE_URL"),  // Use environment variable
        10  // pool size
    );

    auto redis_pool = std::make_shared<RedisPool>("tcp://127.0.0.1:6379");

    PortfolioServiceImpl service(db_pool, redis_pool);

    grpc::ServerBuilder builder;
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);

    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    spdlog::info("Portfolio Manager listening on {}", server_address);
    server->Wait();
}
```

### Performance Considerations

**Memory Management:**
- Use smart pointers (`std::unique_ptr`, `std::shared_ptr`)
- RAII for resource management
- Avoid manual `new`/`delete`

**Concurrency:**
- Thread pool for request handling (gRPC handles this)
- Lock-free data structures where possible
- Connection pools for database/Redis

**Error Handling:**
- Use exceptions for exceptional cases
- `std::expected` (C++23) or `tl::expected` for error handling
- Comprehensive logging with `spdlog`

**Build & Run:**
```bash
# Install dependencies
conan install . --build=missing

# Build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j$(nproc)

# Run
./portfolio_manager
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM ubuntu:22.04 AS builder

RUN apt-get update && apt-get install -y \
    cmake g++ python3-pip libpq-dev \
    && pip3 install conan

WORKDIR /app
COPY . .

RUN conan install . --build=missing && \
    cmake -B build -DCMAKE_BUILD_TYPE=Release && \
    cmake --build build -j$(nproc)

FROM ubuntu:22.04

RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build/portfolio_manager /usr/local/bin/

EXPOSE 50052
CMD ["portfolio_manager"]
```

### Connection Pooling

**TimescaleDB:**
```python
timescale_engine = create_engine(
    TIMESCALE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=3600,
    pool_pre_ping=True
)
```

**PostgreSQL:**
```python
postgres_engine = create_engine(
    POSTGRES_URL,
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=3600,
    pool_pre_ping=True
)
```

### Caching Strategy

Use write-through caching pattern for frequently accessed data:
```python
def get_latest_price(symbol: str):
    cache_key = f"price:{symbol}:latest"
    cached_price = redis.get(cache_key)

    if cached_price:
        return json.loads(cached_price)

    price = db.query(stock_prices)\
        .filter(stock_prices.symbol == symbol)\
        .order_by(stock_prices.time.desc())\
        .first()

    if price:
        redis.setex(cache_key, 300, json.dumps(price))

    return price
```

## Security Considerations

- **Never commit production credentials** to version control
- Use environment variables for database connection strings
- Implement OAuth 2.0 with JWT tokens for authentication
- Apply rate limiting (1000 requests/hour per user)
- Use HTTPS only (TLS 1.3)
- Encrypt sensitive data at rest using `pgcrypto` extension
- Hash passwords with bcrypt
- Rotate database credentials monthly

## API Standards

### Standard Response Format
```json
{
  "status": "success|error",
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2024-12-01T12:00:00Z"
}
```

### Error Response Format
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_SYMBOL",
    "message": "Symbol 'XYZ' not found",
    "details": { ... }
  },
  "timestamp": "2024-12-01T12:00:00Z"
}
```

### Health Check Endpoints
Each service should expose:
- `GET /health` - Simple health check
- `GET /health/ready` - Readiness probe (dependencies OK)
- `GET /health/live` - Liveness probe (service responsive)

## Performance Optimization

### Batch Operations
Prefer batch operations over loops:
```python
# Good
batch_size = 100
for batch in chunks(symbols, batch_size):
    download_prices_batch(batch)

# Bad
for symbol in symbols:
    download_price(symbol)
```

### Circuit Breaker Pattern
Use circuit breakers for service-to-service calls:
```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def get_predictions(symbol: str):
    response = requests.get(
        f"{ANALYSIS_ENGINE_URL}/predictions/{symbol}",
        timeout=5
    )
    return response.json()
```

### Retry Configuration
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def fetch_market_data(symbol: str):
    return external_api.get_price(symbol)
```

## Technology Stack Summary

### Polyglot Microservices Architecture

| Service | Language | Framework | Port | Why This Language |
|---------|----------|-----------|------|-------------------|
| **Market Data** | Python 3.11+ | FastAPI | 50051 | Data processing libraries, rapid development |
| **Analysis Engine** | Python 3.11+ | FastAPI + ML | 50053 | ML/data science ecosystem (required) |
| **Time Series Analysis** | Python 3.11+ | FastAPI + statsmodels | 50056 | Time series libraries (statsmodels, arch, hmmlearn) |
| **Portfolio Manager** | C++23 | gRPC + Pistache | 50052 | Ultra-low latency, high throughput, no GC |
| **Recommendation Engine** | Python 3.11+ | FastAPI | 50054 | Algorithmic logic, integrates with Analysis |
| **Notification Service** | Node.js 18+ | NestJS | 50055 | Async I/O, event processing |
| **API Gateway** | - | Kong/Traefik | 8080 | Industry standard, config-based |

### Key Libraries per Service

**Python Services:**
- FastAPI (async REST framework)
- SQLAlchemy (ORM)
- asyncpg (async PostgreSQL)
- redis-py (Redis client)
- pydantic (data validation)
- grpcio + grpcio-tools (gRPC)

**C++ Portfolio Manager:**
- libpqxx (PostgreSQL client)
- redis-plus-plus (Redis client)
- gRPC C++ (native gRPC)
- spdlog (logging)
- nlohmann/json (JSON)
- Catch2 (testing)
- Boost (utilities)

**Node.js Notification Service:**
- NestJS (framework)
- @grpc/grpc-js (gRPC client)
- @sendgrid/mail (email)
- amqplib (RabbitMQ)

### Build & Deployment

**Python:**
```bash
# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn main:app --host 0.0.0.0 --port 50051
```

**C++:**
```bash
# Build
conan install . --build=missing
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)

# Run
./build/portfolio_manager
```

**Node.js:**
```bash
# Install dependencies
npm install

# Run service
npm run start:prod
```

### Docker Compose Files Structure

**Infrastructure Repositories:**

| Repository | Docker Compose File | Services Included | Ports |
|------------|---------------------|-------------------|-------|
| `trading_platform-infrastructure` | docker-compose.yml | TimescaleDB, PostgreSQL, Redis | 5432, 5433, 6379 |
| `trading_platform-kafka` | docker-compose.yml | Zookeeper, Kafka (3 brokers), Kafka UI, Schema Registry | 2181, 9092-9094, 8080, 8081 |
| `trading_platform-rabbitmq` | docker-compose.yml | RabbitMQ, Management UI | 5672, 15672 |
| `trading_platform-monitoring` | docker-compose.yml | Prometheus, Grafana, Jaeger, Loki | 9090, 3000, 16686, 3100 |
| `trading_platform-api-gateway` | docker-compose.yml | Kong/Traefik, Config DB | 8000, 8001, 8443 |
| `trading_platform-mlflow` | docker-compose.yml | MLflow Server, MinIO (artifact store) | 5000, 9000 |

**Microservice Repositories:**

| Repository | Docker Compose File | gRPC Port | Language | Database |
|------------|---------------------|-----------|----------|----------|
| `trading_platform-market-data` | docker-compose.yml | 50051 | Python | TimescaleDB |
| `trading_platform-analysis-engine` | docker-compose.yml | 50053 | Python | PostgreSQL + MLflow |
| `trading_platform-portfolio-manager` | docker-compose.yml | 50052 | C++23 | PostgreSQL |
| `trading_platform-recommendation-engine` | docker-compose.yml | 50054 | Python | PostgreSQL |
| `trading_platform-notification-service` | docker-compose.yml | 50055 | Node.js | - |
| `trading_platform-timeseries-analysis` | docker-compose.yml | 50056 | Python | PostgreSQL + MLflow |

**Shared Network Configuration:**
All services must join the external Docker network `trading_platform_network`:

```yaml
# In each docker-compose.yml
networks:
  default:
    external: true
    name: trading_platform_network
```

**Create shared network once:**
```bash
docker network create trading_platform_network
```

**Startup Order:**
1. Infrastructure (databases, cache)
2. Kafka + RabbitMQ
3. Monitoring stack
4. MLflow
5. Microservices
6. API Gateway

## Git Workflow for Multi-Repository Setup

Each repository (`Agora_SQL/`, `Agora_Documentation/`, and future service repos) has independent version control:

**Check status across repositories:**
```bash
# Main workspace
git status

# SQL repository
cd Agora_SQL && git status && cd ..

# Documentation repository
cd Agora_Documentation && git status && cd ..
```

**Committing changes:**
```bash
# Navigate to the specific repository
cd Agora_SQL

# Standard git workflow
git add .
git commit -m "Add stock_prices schema"
git push

# Return to main workspace
cd ..
```

**Important**: Always commit to the correct repository based on the type of change:
- Database schemas/SQL → `Agora_SQL/`
- Architecture docs/design specs → `Agora_Documentation/`
- Service implementations → `trading_platform-<service-name>/`

## Troubleshooting

### Database Connection Issues

**Container not running:**
```bash
# Check if container is running
docker ps | grep timescaledb

# If not running, start it
docker-compose up -d

# Check logs for errors
docker logs timescaledb
```

**Connection refused:**
- Ensure Docker is running
- Verify port 5432 is not already in use: `lsof -i :5432`
- Check `.env` file exists and contains correct credentials
- Verify container health: `docker exec timescaledb pg_isready -U agora`

**Permission denied:**
- Check volume permissions: `docker volume inspect timescale_data`
- Reset volume if needed (WARNING: deletes all data):
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

### Docker Network Issues

**Services can't communicate:**
```bash
# Verify shared network exists
docker network ls | grep trading_platform_network

# Create if missing
docker network create trading_platform_network

# Verify service is connected
docker network inspect trading_platform_network
```

### Environment Variables Not Loading

**Symptoms**: Connection errors, undefined variables

**Solution**:
1. Verify `.env` file exists: `ls -la .env`
2. Check file format (no spaces around `=`)
3. Restart services to reload environment:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Reference Documentation

- TimescaleDB: https://docs.timescale.com/
- gRPC Documentation: https://grpc.io/docs/
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/
- Microservices design: `Agora_Documentation/microservice-architecture.md`
- **Time Series Analysis Service:** `Agora_Documentation/timeseries-analysis-service-design.md`
- Service communication: `Agora_Documentation/microservices-communication-guide.md`
- Database design: `Agora_SQL/DatabaseDesign.md`
- Data layer patterns: `Agora_Documentation/data-layer-interaction-matrix.md`
