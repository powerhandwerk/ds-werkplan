// Für alle Tests: React erwartet bei act() diese Kennung, sonst warnt es.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
