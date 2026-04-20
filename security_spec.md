# Firebase Security Specification - Python Job Board

## Data Invariants
1. A Job listing must have a unique slug.
2. Only active jobs are publicly visible.
3. Only verified admins can perform write operations on jobs.
4. Timestamps must be server-generated.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated Write**: Attempt to create a job without logging in.
2. **Standard User Write**: Authenticated user (non-admin) attempts to create a job.
3. **Admin Field Spoofing**: User tries to create an entry in `/admins/` for themselves.
4. **Inactive Job Read**: Non-admin user tries to fetch a job where `is_active == false`.
5. **Slug Poisoning**: Attempt to create a job with a 2MB string for a slug.
6. **Title Injection**: Attempt to inject script tags into `job_title`.
7. **Identity Theft**: User 'A' tries to delete a job created by Node Admins.
8. **Invalid Seniority**: Using "Ninja" instead of "Senior" in `seniority_level`.
9. **Timestamp Manipulation**: Sending a `created_at` from 1990.
10. **Shadow Field Injection**: Adding `is_super_admin: true` to a job document.
11. **Bulk Query Scraping**: Attempting a `list` query without `is_active == true` filter.
12. **Relationship Orphan**: Creating a job referencing a non-existent country (if relational).

## Test Runner Plan
I will implement `firestore.rules` and verify against these invariants.
