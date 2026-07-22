@echo off
setlocal EnableExtensions
title Claude Code - DeepSeek Flash [1M] (xhigh)

REM ---------------------------------------------------------------------------
REM Portable launcher: any PC with Claude Code on PATH.
REM Preconfigured: DeepSeek V4 Flash only + effort xhigh.
REM API key: api-key.local.bat  OR  env DEEPSEEK_API_KEY / ANTHROPIC_AUTH_TOKEN
REM ---------------------------------------------------------------------------

cd /d "%~dp0"

REM --- Load optional local key file ---
if exist "%~dp0api-key.local.bat" (
    call "%~dp0api-key.local.bat"
)

if defined DEEPSEEK_API_KEY (
    set "ANTHROPIC_AUTH_TOKEN=%DEEPSEEK_API_KEY%"
)
if not defined ANTHROPIC_AUTH_TOKEN (
    echo.
    echo  [ERRO] Nenhuma API key DeepSeek encontrada.
    echo.
    echo  Opcoes:
    echo    1^) Defina a variavel de ambiente DEEPSEEK_API_KEY
    echo    2^) Defina ANTHROPIC_AUTH_TOKEN
    echo    3^) Copie api-key.local.bat.example para api-key.local.bat
    echo       e cole sua chave la.
    echo.
    echo  Obtenha a chave em: https://platform.deepseek.com
    echo.
    pause
    exit /b 1
)

REM --- Locate Claude Code ---
set "CLAUDE_CMD="
where claude >nul 2>&1
if not errorlevel 1 (
    for /f "delims=" %%I in ('where claude 2^>nul') do (
        if not defined CLAUDE_CMD set "CLAUDE_CMD=%%I"
    )
)

if not defined CLAUDE_CMD if exist "%APPDATA%\npm\claude.cmd" set "CLAUDE_CMD=%APPDATA%\npm\claude.cmd"
if not defined CLAUDE_CMD if exist "%ProgramFiles%\nodejs\claude.cmd" set "CLAUDE_CMD=%ProgramFiles%\nodejs\claude.cmd"
if not defined CLAUDE_CMD if exist "%LOCALAPPDATA%\Programs\claude\claude.exe" set "CLAUDE_CMD=%LOCALAPPDATA%\Programs\claude\claude.exe"

if not defined CLAUDE_CMD (
    echo.
    echo  [ERRO] Claude Code nao encontrado neste PC.
    echo.
    echo  Instale com:
    echo    npm install -g @anthropic-ai/claude-code
    echo.
    echo  Depois confira no CMD:
    echo    where claude
    echo.
    pause
    exit /b 1
)

REM --- DeepSeek Flash only + xhigh (principal e subagentes) ---
set "ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic"
set "ANTHROPIC_MODEL=deepseek-v4-flash[1m]"
set "ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-flash[1m]"
set "ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-flash[1m]"
set "ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash[1m]"
set "CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash[1m]"
set "CLAUDE_CODE_EFFORT_LEVEL=xhigh"
set "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1"

echo.
echo  Iniciando Claude Code...
echo  Executavel:        %CLAUDE_CMD%
echo  Modelo (tudo):     DeepSeek V4 Flash [1M]
echo  Esforco:           xhigh
echo  Permissoes:        Bypass
echo  Pasta de trabalho: %CD%
echo.

"%CLAUDE_CMD%" --model "deepseek-v4-flash[1m]" --effort xhigh --permission-mode bypassPermissions
set "EXITCODE=%ERRORLEVEL%"

if not "%EXITCODE%"=="0" (
    echo.
    echo  Claude Code encerrou com erro ^(codigo %EXITCODE%^).
    echo  Pressione qualquer tecla para fechar.
    pause >nul
)

endlocal & exit /b %EXITCODE%
