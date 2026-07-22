<?php
/**
 * View Renderer
 * SocialNet - Premium Social Network Platform
 */

namespace Core;

class View
{
    private string $viewsPath;
    private string $componentsPath;

    /**
     * View constructor
     */
    public function __construct()
    {
        $this->viewsPath = dirname(__DIR__) . '/pages';
        $this->componentsPath = dirname(__DIR__) . '/components';
    }

    /**
     * Render a view
     */
    public function render(string $view, array $data = []): void
    {
        $viewFile = $this->viewsPath . '/' . $view . '.php';

        if (!file_exists($viewFile)) {
            throw new \RuntimeException("View not found: {$view}");
        }

        // Extract data for use in view
        extract($data, EXTR_SKIP);

        // Start output buffering
        ob_start();
        include $viewFile;
        $content = ob_get_clean();

        echo $content;
    }

    /**
     * Render a layout with content
     */
    public function renderWithLayout(string $view, string $layout, array $data = []): void
    {
        // Capture content from view
        ob_start();
        $this->render($view, $data);
        $content = ob_get_clean();

        // Capture components
        $components = $this->captureComponents($data);

        // Merge data
        $data['content'] = $content;
        $data = array_merge($data, $components);

        // Render layout
        $this->render('layouts/' . $layout, $data);
    }

    /**
     * Render a component
     */
    public function component(string $component, array $data = []): void
    {
        $componentFile = $this->componentsPath . '/' . $component . '.php';

        if (!file_exists($componentFile)) {
            throw new \RuntimeException("Component not found: {$component}");
        }

        extract($data, EXTR_SKIP);
        include $componentFile;
    }

    /**
     * Capture component slots
     */
    private function captureComponents(array $data): array
    {
        $components = [];

        foreach ($data as $key => $value) {
            if (str_starts_with($key, 'slot_') || str_starts_with($key, 'component_')) {
                $components[$key] = $value;
            }
        }

        return $components;
    }

    /**
     * Render raw string template with simple variable replacement
     */
    public static function renderString(string $template, array $data = []): string
    {
        $keys = array_map(fn($k) => '{{' . $k . '}}', array_keys($data));
        $values = array_values($data);
        return str_replace($keys, $values, $template);
    }

    /**
     * Include and return component as string
     */
    public function captureComponent(string $component, array $data = []): string
    {
        ob_start();
        $this->component($component, $data);
        return ob_get_clean();
    }
}
