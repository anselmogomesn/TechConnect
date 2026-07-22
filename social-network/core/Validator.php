<?php
/**
 * Form Validator
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

class Validator
{
    private array $errors = [];
    private array $data = [];
    private array $validated = [];

    /**
     * Validate data against rules
     */
    public function validate(array $data, array $rules): array
    {
        $this->data = $data;
        $this->errors = [];
        $this->validated = [];

        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $label = $this->getFieldLabel($field);

            // Split rules by pipe
            $ruleList = is_string($fieldRules) ? explode('|', $fieldRules) : $fieldRules;

            foreach ($ruleList as $rule) {
                $params = [];

                // Check for parameters: min:8
                if (str_contains($rule, ':')) {
                    [$rule, $paramStr] = explode(':', $rule, 2);
                    $params = explode(',', $paramStr);
                }

                $methodName = 'rule' . ucfirst($rule);
                if (method_exists($this, $methodName)) {
                    $this->$methodName($field, $value, $label, $params);
                }
            }
        }

        if (empty($this->errors)) {
            $this->validated = $this->filterValidated($data, $rules);
        }

        return [
            'valid' => empty($this->errors),
            'errors' => $this->errors,
            'data' => $this->validated,
        ];
    }

    /**
     * Filter only validated fields
     */
    private function filterValidated(array $data, array $rules): array
    {
        $validated = [];
        foreach ($rules as $field => $fieldRules) {
            if (isset($data[$field])) {
                $validated[$field] = Security::clean($data[$field]);
            }
        }
        return $validated;
    }

    /**
     * Get human-readable field label
     */
    private function getFieldLabel(string $field): string
    {
        $labels = [
            'first_name' => 'Nome',
            'last_name' => 'Sobrenome',
            'username' => 'Nome de usuário',
            'email' => 'E-mail',
            'password' => 'Senha',
            'password_confirmation' => 'Confirmação de senha',
            'birth_date' => 'Data de nascimento',
            'gender' => 'Gênero',
            'biography' => 'Biografia',
            'location' => 'Localização',
            'website' => 'Website',
            'phone' => 'Telefone',
            'terms' => 'Termos de uso',
            'current_password' => 'Senha atual',
            'new_password' => 'Nova senha',
            'content' => 'Conteúdo',
            'title' => 'Título',
            'description' => 'Descrição',
            'price' => 'Preço',
            'category' => 'Categoria',
        ];

        return $labels[$field] ?? ucfirst(str_replace('_', ' ', $field));
    }

    // ---- Rule Methods ----

    private function ruleRequired(string $field, mixed $value, string $label, array $params): void
    {
        if ($value === null || (is_string($value) && trim($value) === '') || (is_array($value) && empty($value))) {
            $this->addError($field, "O campo {$label} é obrigatório.");
        }
    }

    private function ruleEmail(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !Security::validateEmail($value)) {
            $this->addError($field, "O campo {$label} deve ser um e-mail válido.");
        }
    }

    private function ruleMin(string $field, mixed $value, string $label, array $params): void
    {
        $min = (int)($params[0] ?? 0);
        if (is_string($value) && strlen($value) < $min) {
            $this->addError($field, "O campo {$label} deve ter no mínimo {$min} caracteres.");
        }
        if (is_numeric($value) && $value < $min) {
            $this->addError($field, "O campo {$label} deve ser no mínimo {$min}.");
        }
    }

    private function ruleMax(string $field, mixed $value, string $label, array $params): void
    {
        $max = (int)($params[0] ?? 0);
        if (is_string($value) && strlen($value) > $max) {
            $this->addError($field, "O campo {$label} deve ter no máximo {$max} caracteres.");
        }
        if (is_numeric($value) && $value > $max) {
            $this->addError($field, "O campo {$label} deve ser no máximo {$max}.");
        }
    }

    private function ruleBetween(string $field, mixed $value, string $label, array $params): void
    {
        $min = (int)($params[0] ?? 0);
        $max = (int)($params[1] ?? 0);
        $len = is_string($value) ? strlen($value) : (is_numeric($value) ? $value : 0);
        if ($len < $min || $len > $max) {
            $this->addError($field, "O campo {$label} deve estar entre {$min} e {$max}.");
        }
    }

    private function ruleAlpha(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !preg_match('/^[a-zA-Z]+$/', $value)) {
            $this->addError($field, "O campo {$label} deve conter apenas letras.");
        }
    }

    private function ruleAlphanumeric(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !preg_match('/^[a-zA-Z0-9]+$/', $value)) {
            $this->addError($field, "O campo {$label} deve conter apenas letras e números.");
        }
    }

    private function ruleUsername(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !Security::validateUsername($value)) {
            $this->addError($field, "O campo {$label} deve conter 3-30 caracteres: letras, números, _ e .");
        }
    }

    private function ruleUrl(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !Security::validateUrl($value)) {
            $this->addError($field, "O campo {$label} deve ser uma URL válida.");
        }
    }

    private function ruleConfirmed(string $field, mixed $value, string $label, array $params): void
    {
        $confirmationField = $field . '_confirmation';
        $confirmation = $this->data[$confirmationField] ?? null;
        if ($value !== $confirmation) {
            $this->addError($field, "A confirmação do campo {$label} não corresponde.");
        }
    }

    private function ruleUnique(string $field, mixed $value, string $label, array $params): void
    {
        if (empty($value)) return;

        $table = $params[0] ?? null;
        $ignoreId = $params[1] ?? null;
        $ignoreColumn = $params[2] ?? 'id';

        if (!$table) return;

        $db = Database::getInstance();
        $sql = "SELECT COUNT(*) FROM {$table} WHERE {$field} = :value";
        $bindings = ['value' => $value];

        if ($ignoreId) {
            $sql .= " AND {$ignoreColumn} != :ignore_id";
            $bindings['ignore_id'] = $ignoreId;
        }

        $count = (int)$db->fetchColumn($sql, $bindings);
        if ($count > 0) {
            $this->addError($field, "Este {$label} já está em uso.");
        }
    }

    private function ruleExists(string $field, mixed $value, string $label, array $params): void
    {
        if (empty($value)) return;

        $table = $params[0] ?? null;
        $column = $params[1] ?? $field;

        if (!$table) return;

        $db = Database::getInstance();
        $count = (int)$db->fetchColumn(
            "SELECT COUNT(*) FROM {$table} WHERE {$column} = :value",
            ['value' => $value]
        );

        if ($count === 0) {
            $this->addError($field, "O {$label} informado não foi encontrado.");
        }
    }

    private function ruleDate(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !strtotime($value)) {
            $this->addError($field, "O campo {$label} deve ser uma data válida.");
        }
    }

    private function ruleAfter(string $field, mixed $value, string $label, array $params): void
    {
        $date = $params[0] ?? 'today';
        $compareDate = $date === 'today' ? date('Y-m-d') : $date;
        if (!empty($value) && strtotime($value) <= strtotime($compareDate)) {
            $this->addError($field, "O campo {$label} deve ser após {$date}.");
        }
    }

    private function ruleBefore(string $field, mixed $value, string $label, array $params): void
    {
        $date = $params[0] ?? 'today';
        $compareDate = $date === 'today' ? date('Y-m-d') : $date;
        if (!empty($value) && strtotime($value) >= strtotime($compareDate)) {
            $this->addError($field, "O campo {$label} deve ser antes de {$date}.");
        }
    }

    private function ruleNumeric(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !is_numeric($value)) {
            $this->addError($field, "O campo {$label} deve ser numérico.");
        }
    }

    private function ruleBoolean(string $field, mixed $value, string $label, array $params): void
    {
        if ($value !== null && !in_array((string)$value, ['1', '0', 'true', 'false', 1, 0, true, false], true)) {
            $this->addError($field, "O campo {$label} deve ser verdadeiro ou falso.");
        }
    }

    private function ruleIn(string $field, mixed $value, string $label, array $params): void
    {
        if (!empty($value) && !in_array($value, $params)) {
            $allowed = implode(', ', $params);
            $this->addError($field, "O campo {$label} deve ser um dos seguintes: {$allowed}.");
        }
    }

    private function ruleArray(string $field, mixed $value, string $label, array $params): void
    {
        if ($value !== null && !is_array($value)) {
            $this->addError($field, "O campo {$label} deve ser um array.");
        }
    }

    private function ruleImage(string $field, mixed $value, string $label, array $params): void
    {
        if ($value && is_array($value) && isset($value['tmp_name']) && !empty($value['tmp_name'])) {
            $validation = Security::validateFile($value, ALLOWED_IMAGES, MAX_IMAGE_SIZE);
            if (!$validation['valid']) {
                foreach ($validation['errors'] as $error) {
                    $this->addError($field, $error);
                }
            }
        }
    }

    /**
     * Add error message
     */
    private function addError(string $field, string $message): void
    {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }

    /**
     * Get all errors
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get first error for a field
     */
    public function getFirstError(string $field): ?string
    {
        return $this->errors[$field][0] ?? null;
    }

    /**
     * Check if field has error
     */
    public function hasError(string $field): bool
    {
        return isset($this->errors[$field]) && !empty($this->errors[$field]);
    }
}
