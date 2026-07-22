<?php
/**
 * Database Class - PDO Singleton
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

use PDO;
use PDOException;
use PDOStatement;

class Database
{
    private static ?Database $instance = null;
    private PDO $connection;
    private PDOStatement $statement;
    private int $fetchMode = PDO::FETCH_OBJ;
    private bool $inTransaction = false;

    private function __construct()
    {
        try {
            $dsn = sprintf(
                '%s:host=%s;dbname=%s;charset=%s',
                DB_DRIVER,
                DB_HOST,
                DB_NAME,
                DB_CHARSET
            );

            $this->connection = new PDO($dsn, DB_USER, DB_PASS, DB_OPTIONS);
        } catch (PDOException $e) {
            throw new \RuntimeException('Database connection failed: ' . $e->getMessage());
        }
    }

    /**
     * Prevent cloning and unserialization
     */
    private function __clone() {}
    public function __wakeup()
    {
        throw new \Exception('Cannot unserialize singleton');
    }

    /**
     * Get database instance
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Get PDO connection
     */
    public function getConnection(): PDO
    {
        return $this->connection;
    }

    /**
     * Prepare a query
     */
    public function query(string $sql, array $params = []): self
    {
        $this->statement = $this->connection->prepare($sql);
        $this->statement->execute($params);
        return $this;
    }

    /**
     * Fetch all results
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        $this->query($sql, $params);
        return $this->statement->fetchAll($this->fetchMode) ?: [];
    }

    /**
     * Fetch single result
     */
    public function fetch(string $sql, array $params = []): ?object
    {
        $this->query($sql, $params);
        $result = $this->statement->fetch($this->fetchMode);
        return $result ?: null;
    }

    /**
     * Fetch single column value
     */
    public function fetchColumn(string $sql, array $params = []): mixed
    {
        $this->query($sql, $params);
        return $this->statement->fetchColumn();
    }

    /**
     * Insert and return last insert ID
     */
    public function insert(string $table, array $data): ?string
    {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        $this->query($sql, $data);

        return $this->connection->lastInsertId() ?: null;
    }

    /**
     * Update records
     */
    public function update(string $table, array $data, string $where, array $whereParams = []): int
    {
        $sets = implode(', ', array_map(fn($col) => "{$col} = :{$col}", array_keys($data)));

        $sql = "UPDATE {$table} SET {$sets} WHERE {$where}";
        $this->query($sql, array_merge($data, $whereParams));

        return $this->statement->rowCount();
    }

    /**
     * Delete records
     */
    public function delete(string $table, string $where, array $params = []): int
    {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $this->query($sql, $params);
        return $this->statement->rowCount();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction(): bool
    {
        if (!$this->inTransaction) {
            $this->inTransaction = $this->connection->beginTransaction();
        }
        return $this->inTransaction;
    }

    /**
     * Commit transaction
     */
    public function commit(): bool
    {
        if ($this->inTransaction) {
            $this->inTransaction = false;
            return $this->connection->commit();
        }
        return false;
    }

    /**
     * Rollback transaction
     */
    public function rollback(): bool
    {
        if ($this->inTransaction) {
            $this->inTransaction = false;
            return $this->connection->rollBack();
        }
        return false;
    }

    /**
     * Get last inserted ID
     */
    public function lastInsertId(): string
    {
        return $this->connection->lastInsertId();
    }

    /**
     * Get row count from last query
     */
    public function rowCount(): int
    {
        return $this->statement->rowCount();
    }

    /**
     * Check if table exists
     */
    public function tableExists(string $table): bool
    {
        try {
            $this->connection->query("SELECT 1 FROM {$table} LIMIT 1");
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Escape string
     */
    public function escape(string $value): string
    {
        return substr($this->connection->quote($value), 1, -1);
    }

    /**
     * Paginate results
     */
    public function paginate(string $sql, array $params = [], int $page = 1, int $perPage = 15): object
    {
        $countSql = preg_replace('/SELECT.*?FROM/is', 'SELECT COUNT(*) as total FROM', $sql);
        $countSql = preg_replace('/\s+ORDER\s+BY\s+.*/i', '', $countSql);
        $countSql = preg_replace('/\s+LIMIT\s+.*/i', '', $countSql);

        $total = $this->fetchColumn($countSql, $params);
        $totalPages = max(1, (int)ceil($total / $perPage));
        $page = max(1, min($page, $totalPages));
        $offset = ($page - 1) * $perPage;

        $sql .= " LIMIT {$perPage} OFFSET {$offset}";
        $data = $this->fetchAll($sql, $params);

        return (object)[
            'data' => $data,
            'currentPage' => $page,
            'perPage' => $perPage,
            'total' => (int)$total,
            'totalPages' => $totalPages,
            'hasMore' => $page < $totalPages,
            'hasPrevious' => $page > 1,
            'nextPage' => $page < $totalPages ? $page + 1 : null,
            'previousPage' => $page > 1 ? $page - 1 : null,
        ];
    }
}
