# Consumer changes accompanying the Next 16 migration

Apply `planet-training-next16.patch` from the root of the separate `websites`
repository when upgrading its Planet consumer. The verification preparation
script also applies this correction to its isolated copy; it does not edit the
source checkout.

The legacy `/en/blog/dealing-failure` redirect has the relative destination
`dealing -failure`. Next 16 throws `TypeError: Invalid URL`, producing HTTP 500.
The patch uses the absolute, encoded path `/dealing%20-failure`, matching the
current live redirect destination. That destination already returns HTTP 404
on production. Choosing the intended replacement article is a separate content
correction; this patch only removes the migration-induced server error.
