# Data Ingestion

## Import Assistant

The import center uses this flow:

1. Select country.
2. Select company.
3. Select branch.
4. Select data type.
5. Select period.
6. Download template.
7. Upload file.
8. Detect headers.
9. Map columns.
10. Validate.
11. Preview.
12. Show errors.
13. Show warnings.
14. Confirm import.
15. Process.
16. Show result.
17. Register audit.

## Supported Formats

- CSV
- XLSX
- XLS

PDF files may be stored as documentary backup, but must not generate KPIs automatically unless an approved parser exists.

## Validations

- data types
- required fields
- dates
- amounts
- duplicates
- identifiers
- country
- company
- branch
- manager
- service
- professional
- appointment status
- period
- cross-column consistency

No error may import silently.

## Error Handling

Users can download an error report, correct mapping, retry, cancel, view history, and request reversal when no later dependency exists.

## Templates

Initial downloadable templates:

- appointments
- capacity and schedules
- fisioterapia
- laboratorio
- imagenes
- invoicing
- payments
- direct costs
- targets
- professionals
- services
- branches
- managers
- CRM and referrers

Each template includes instructions, column definitions, required fields, expected format, DEMO examples, valid catalogs, frequent errors, and template version.

