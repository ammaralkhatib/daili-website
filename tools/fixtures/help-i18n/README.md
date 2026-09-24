A tiny German translation of the two English articles that
tools/test-check-help.mjs writes into its throwaway fixture (family-invite and
start-home). The test copies it to help/de/ there, proves the guard accepts it,
plants one break at a time in it, and builds it (pages + help/de.json) with
HELP_TEST_ROOT. Not a real translation, and never read by the real build.
