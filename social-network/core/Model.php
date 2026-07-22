<?php
/**
 * Base Model - Active Record Pattern
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

abstract class Model
{
    protected static string $table;
    protected static string $primaryKey = 'id';
    protected static bool $usesUuid = false;
    protected array $attributes = [];
    protected array $original = [];
    protected array $fillable = [];
    protected array $guarded = ['id', 'created_at', 'updated_at'];
    protected array $casts = [];
    protected ?Database $db = null;

    /**
     * Model constructor
     */
    public function __construct(array $attributes = [])
    {
        $this->db = Database::getInstance();
        $this->fill($attributes);
    }

    /**
     * Fill model attributes
     */
    public function fill(array $attributes): void
    {
        foreach ($attributes as $key => $value) {
            if ($this->isFillable($key)) {
                $this->attributes[$key] = $this->castValue($key, $value);
            }
        }
    }

    /**
     * Check if attribute is fillable
     */
    protected function isFillable(string $key): bool
    {
        if (in_array($key, $this->guarded)) {
            return false;
        }

        if (!empty($this->fillable)) {
            return in_array($key, $this->fillable);
        }

        return true;
    }

    /**
     * Cast attribute value
     */
    protected function castValue(string $key, mixed $value): mixed
    {
        if (!isset($this->casts[$key])) {
            return $value;
        }

        return match ($this->casts[$key]) {
            'int', 'integer' => (int)$value,
            'float', 'double' => (float)$value,
            'bool', 'boolean' => (bool)$value,
            'array' => json_decode($value ?? '[]', true),
            'object' => json_decode($value ?? '{}'),
            'json' => is_string($value) ? json_decode($value, true) : $value,
            'date' => $value,
            default => $value,
        };
    }

    /**
     * Save model
     */
    public function save(): bool
    {
        if ($this->exists()) {
            return $this->update();
        }
        return $this->insert();
    }

    /**
     * Insert new record
     */
    protected function insert(): bool
    {
        if (static::$usesUuid && !isset($this->attributes['uuid'])) {
            $this->attributes['uuid'] = Security::generateUuid();
        }

        $data = $this->attributes;
        unset($data[static::$primaryKey]);

        $id = $this->db->insert(static::$table, $data);

        if ($id) {
            $this->attributes[static::$primaryKey] = $id;
            $this->original = $this->attributes;
            return true;
        }

        return false;
    }

    /**
     * Update existing record
     */
    protected function update(): bool
    {
        $changes = [];
        foreach ($this->attributes as $key => $value) {
            if (!isset($this->original[$key]) || $this->original[$key] !== $value) {
                $changes[$key] = $value;
            }
        }

        if (empty($changes)) {
            return true;
        }

        $id = $this->original[static::$primaryKey];
        $updated = $this->db->update(
            static::$table,
            $changes,
            static::$primaryKey . ' = :id',
            ['id' => $id]
        );

        $this->original = $this->attributes;
        return $updated !== false;
    }

    /**
     * Delete record
     */
    public function delete(): bool
    {
        if (!$this->exists()) {
            return false;
        }

        $id = $this->attributes[static::$primaryKey];
        return $this->db->delete(static::$table, static::$primaryKey . ' = :id', ['id' => $id]) > 0;
    }

    /**
     * Check if record exists
     */
    public function exists(): bool
    {
        return isset($this->attributes[static::$primaryKey]) && !empty($this->original);
    }

    /**
     * Find by primary key
     */
    public static function find(int|string $id): ?static
    {
        $db = Database::getInstance();
        $result = $db->fetch(
            "SELECT * FROM " . static::$table . " WHERE " . static::$primaryKey . " = :id",
            ['id' => $id]
        );

        if (!$result) return null;

        $model = new static();
        $model->attributes = (array)$result;
        $model->original = (array)$result;
        return $model;
    }

    /**
     * Find by UUID
     */
    public static function findByUuid(string $uuid): ?static
    {
        return static::findBy('uuid', $uuid);
    }

    /**
     * Find by field
     */
    public static function findBy(string $field, mixed $value): ?static
    {
        $db = Database::getInstance();
        $result = $db->fetch(
            "SELECT * FROM " . static::$table . " WHERE {$field} = :value LIMIT 1",
            ['value' => $value]
        );

        if (!$result) return null;

        $model = new static();
        $model->attributes = (array)$result;
        $model->original = (array)$result;
        return $model;
    }

    /**
     * Get all records
     */
    public static function all(array $conditions = []): array
    {
        $db = Database::getInstance();
        $sql = "SELECT * FROM " . static::$table;

        if (!empty($conditions)) {
            $wheres = [];
            foreach ($conditions as $key => $value) {
                $wheres[] = "{$key} = :{$key}";
            }
            $sql .= " WHERE " . implode(' AND ', $wheres);
        }

        $sql .= " ORDER BY created_at DESC";

        return $db->fetchAll($sql, $conditions);
    }

    /**
     * Paginate results
     */
    public static function paginate(int $page = 1, int $perPage = 15, array $conditions = []): object
    {
        $db = Database::getInstance();
        $sql = "SELECT * FROM " . static::$table;

        if (!empty($conditions)) {
            $wheres = [];
            foreach ($conditions as $key => $value) {
                $wheres[] = "{$key} = :{$key}";
            }
            $sql .= " WHERE " . implode(' AND ', $wheres);
        }

        $sql .= " ORDER BY created_at DESC";

        return $db->paginate($sql, $conditions, $page, $perPage);
    }

    /**
     * Get attribute
     */
    public function __get(string $name): mixed
    {
        return $this->attributes[$name] ?? null;
    }

    /**
     * Set attribute
     */
    public function __set(string $name, mixed $value): void
    {
        $this->attributes[$name] = $this->castValue($name, $value);
    }

    /**
     * Check if attribute is set
     */
    public function __isset(string $name): bool
    {
        return isset($this->attributes[$name]);
    }

    /**
     * Convert to array
     */
    public function toArray(): array
    {
        return $this->attributes;
    }

    /**
     * Convert to JSON
     */
    public function toJson(): string
    {
        return json_encode($this->attributes, JSON_UNESCAPED_UNICODE);
    }

    /**
     * Get table name
     */
    public static function getTable(): string
    {
        return static::$table;
    }

    /**
     * Count records
     */
    public static function count(array $conditions = []): int
    {
        $db = Database::getInstance();
        $sql = "SELECT COUNT(*) FROM " . static::$table;

        if (!empty($conditions)) {
            $wheres = [];
            foreach ($conditions as $key => $value) {
                $wheres[] = "{$key} = :{$key}";
            }
            $sql .= " WHERE " . implode(' AND ', $wheres);
        }

        return (int)$db->fetchColumn($sql, $conditions);
    }
}
