# Test Case — API Tariff (getfeeLnDiscountNew)

| ID | Judul | Endpoint | Request | Expected | Priority | Status |
|----|-------|----------|---------|----------|----------|--------|
| TC-P001 | Request valid standar | POST /getfeeLnDiscountNew | Body valid lengkap | Status 200, response JSON | High | PASS |
| TC-P002 | Weight dalam gram | POST /getfeeLnDiscountNew | weight: 1000 | Status 200, tarif dikembalikan | High | PASS |
| TC-P003 | itemtypeid = 1 | POST /getfeeLnDiscountNew | itemtypeid: 1 | Status 200, data tersedia | Medium | PASS |
| TC-P004 | desttypeid = 0 | POST /getfeeLnDiscountNew | desttypeid: 0 | Status 200, data tersedia | Medium | PASS |
| TC-P005 | Domestic shipping | POST /getfeeLnDiscountNew | receiver: 10110 | Status 200, tarif domestic | High | PASS |
| TC-P006 | International shipping | POST /getfeeLnDiscountNew | receiver: MY | Status 200, tarif internasional | High | PASS |
| TC-P007 | Weight besar 10kg | POST /getfeeLnDiscountNew | weight: 10000 | Status 200, tarif sesuai | Medium | PASS |
| TC-P008 | Dimensi paket | POST /getfeeLnDiscountNew | 30x20x15 cm | Status 200, tarif termasuk dimensi | Medium | PASS |
| TC-P009 | Valuegoods tinggi | POST /getfeeLnDiscountNew | valuegoods: 1000000 | Status 200, asuransi sesuai | Medium | PASS |
| TC-P010 | Customerid terisi | POST /getfeeLnDiscountNew | customerid: CUST-001 | Status 200, data tersedia | Low | PASS |
| TC-P011 | Response JSON | POST /getfeeLnDiscountNew | Valid body | Content-Type: application/json | High | PASS |
| TC-P012 | Response time < 5s | POST /getfeeLnDiscountNew | Valid body | Duration < 5000ms | High | PASS |
| TC-N001 | Body kosong | POST /getfeeLnDiscountNew | {} | Status 4xx (reject) | High | FAIL |
| TC-N002 | Tanpa body | POST /getfeeLnDiscountNew | null | Status 4xx (reject) | High | FAIL |
| TC-N003 | Weight negatif | POST /getfeeLnDiscountNew | weight: -100 | Status 4xx (reject) | High | FAIL |
| TC-N004 | Weight nol | POST /getfeeLnDiscountNew | weight: 0 | Status 200 atau 4xx | Medium | PASS |
| TC-N005 | Weight string | POST /getfeeLnDiscountNew | weight: abc | Status 4xx (reject) | High | FAIL |
| TC-N006 | Shipper kosong | POST /getfeeLnDiscountNew | shipperzipcode: "" | Status 4xx (reject) | High | FAIL |
| TC-N007 | Receiver kosong | POST /getfeeLnDiscountNew | receiverzipcode: "" | Status 4xx (reject) | High | FAIL |
| TC-N008 | Valuegoods negatif | POST /getfeeLnDiscountNew | valuegoods: -500 | Status 4xx (reject) | High | FAIL |
| TC-N009 | Field hilang | POST /getfeeLnDiscountNew | shipperzipcode missing | Status 4xx (reject) | High | FAIL |
| TC-N010 | Invalid JSON | POST /getfeeLnDiscountNew | {invalid json | Status 4xx (reject) | High | FAIL |
| TC-N011 | Tanpa Content-Type | POST /getfeeLnDiscountNew | No CT header | Status 200 atau 4xx | Medium | PASS |
| TC-N012 | Content-Type text/plain | POST /getfeeLnDiscountNew | CT: text/plain | Status 4xx (reject) | Medium | FAIL |
| TC-N013 | Extra fields | POST /getfeeLnDiscountNew | unknownField: test | Status 200 (toleran) | Low | PASS |
| TC-N014 | Weight overflow | POST /getfeeLnDiscountNew | weight: MAX_SAFE_INT | Status 200 atau 4xx | Medium | PASS |
| TC-N015 | Weight float | POST /getfeeLnDiscountNew | weight: 1000.5 | Status 200 atau 4xx | Low | PASS |
| TC-N016 | Zipcode bukan angka | POST /getfeeLnDiscountNew | shipperzipcode: ABCDE | Status 4xx (reject) | Medium | FAIL |
| TC-N017 | Method GET | GET /getfeeLnDiscountNew | - | Status 404 atau 405 | Medium | PASS |
| TC-N018 | Method PUT | PUT /getfeeLnDiscountNew | - | Status 404 atau 405 | Medium | PASS |
| TC-N019 | URL typo | POST /getfeeLnDiscountNewTypo | - | Status 404 | Medium | PASS |
| TC-N020 | Array body | POST /getfeeLnDiscountNew | [body] | Status 4xx (reject) | Medium | FAIL |
| TC-B001 | Weight minimum 1g | POST /getfeeLnDiscountNew | weight: 1 | Status 200 | Medium | PASS |
| TC-B002 | Weight 0 | POST /getfeeLnDiscountNew | weight: 0 | Status 200 | Medium | PASS |
| TC-B003 | Weight -1 | POST /getfeeLnDiscountNew | weight: -1 | Status 4xx | High | FAIL |
| TC-B004 | Weight 30kg | POST /getfeeLnDiscountNew | weight: 30000 | Status 200 | Medium | PASS |
| TC-B005 | Weight 30001g | POST /getfeeLnDiscountNew | weight: 30001 | Status 200 atau 4xx | Medium | PASS |
| TC-B006 | Weight MAX_INT | POST /getfeeLnDiscountNew | weight: 2147483647 | Status 200 | Low | PASS |
| TC-B007 | Dimensi 0x0x0 | POST /getfeeLnDiscountNew | all dims: 0 | Status 200 | Medium | PASS |
| TC-B008 | Dimensi 1x1x1 | POST /getfeeLnDiscountNew | all dims: 1 | Status 200 | Medium | PASS |
| TC-B009 | Dimensi negatif | POST /getfeeLnDiscountNew | all dims: -1 | Status 4xx | High | FAIL |
| TC-B010 | Dimensi 100x100x100 | POST /getfeeLnDiscountNew | all dims: 100 | Status 200 | Medium | PASS |
| TC-B011 | Dimensi MAX_INT | POST /getfeeLnDiscountNew | all dims: MAX_INT | Status 200 | Low | PASS |
| TC-B012 | Valuegoods 0 | POST /getfeeLnDiscountNew | valuegoods: 0 | Status 200 | Medium | PASS |
| TC-B013 | Valuegoods 1 | POST /getfeeLnDiscountNew | valuegoods: 1 | Status 200 | Medium | PASS |
| TC-B014 | Valuegoods -1 | POST /getfeeLnDiscountNew | valuegoods: -1 | Status 4xx | High | FAIL |
| TC-B015 | Valuegoods MAX_INT | POST /getfeeLnDiscountNew | valuegoods: MAX_INT | Status 200 | Low | PASS |
| TC-B016 | Semua string kosong | POST /getfeeLnDiscountNew | all strings: "" | Status 200 | Medium | PASS |
| TC-B017 | String 1000 char | POST /getfeeLnDiscountNew | customerid: 1000xA | Status 200 | Low | PASS |
| TC-B018 | String 1 char | POST /getfeeLnDiscountNew | customerid: X | Status 200 | Low | PASS |
| TC-B019 | Zipcode 5 digit | POST /getfeeLnDiscountNew | shipper: 10110 | Status 200 | Medium | PASS |
| TC-B020 | Zipcode 1 digit | POST /getfeeLnDiscountNew | shipper: 1 | Status 4xx | Medium | FAIL |
| TC-B021 | Receiver 2 char | POST /getfeeLnDiscountNew | receiver: MY | Status 200 | Medium | PASS |
| TC-B022 | Receiver 1 char | POST /getfeeLnDiscountNew | receiver: M | Status 4xx | Medium | FAIL |
| TC-B023 | Receiver domestic | POST /getfeeLnDiscountNew | receiver: 10110 | Status 200 | Medium | PASS |
| TC-B024 | Diameter 0 | POST /getfeeLnDiscountNew | diameter: 0 | Status 200 | Medium | PASS |
| TC-B025 | Diameter 50 | POST /getfeeLnDiscountNew | diameter: 50 | Status 200 | Low | PASS |
| TC-S001 | SQL Injection | POST /getfeeLnDiscountNew | shipper: ' OR 1=1 | Status < 500 | Critical | FAIL |
| TC-S002 | SQL Injection DROP | POST /getfeeLnDiscountNew | receiver: '; DROP TABLE | Status 4xx | Critical | PASS |
| TC-S003 | SQL Injection UNION | POST /getfeeLnDiscountNew | customer: UNION SELECT | Status 4xx | Critical | PASS |
| TC-S004 | XSS script tag | POST /getfeeLnDiscountNew | customer: script | Status < 500 | Critical | FAIL |
| TC-S005 | XSS img onerror | POST /getfeeLnDiscountNew | shipper: img onerror | Status 4xx | Critical | PASS |
| TC-S006 | XSS event handler | POST /getfeeLnDiscountNew | receiver: onmouseover | Status 4xx | Critical | PASS |
| TC-S007 | CRLF Injection | POST /getfeeLnDiscountNew | Content-Type CRLF | Status < 500 | Critical | PASS |
| TC-S008 | X-Forwarded-For | POST /getfeeLnDiscountNew | XFF: 127.0.0.1 | Status 200 | High | PASS |
| TC-S009 | Path traversal | POST /getfeeLnDiscountNew | customer: ../../../etc | Status < 500 | Critical | FAIL |
| TC-S010 | Invalid Transfer-Encoding | POST /getfeeLnDiscountNew | TE: chunked,identity | Status 400 | High | PASS |
| TC-S011 | Oversized Content-Length | POST /getfeeLnDiscountNew | CL: 999999999 | Status 200 | Medium | PASS |
| TC-S012 | Tanpa auth | POST /getfeeLnDiscountNew | No auth header | Status 200 | High | PASS |
| TC-S013 | Invalid token | POST /getfeeLnDiscountNew | Bearer invalid | Status 200 | High | PASS |
| TC-S014 | Malformed auth | POST /getfeeLnDiscountNew | NotBearer value | Status 200 | Medium | PASS |
| TC-S015 | XXE attack | POST /getfeeLnDiscountNew | XML body | Status < 500 | Critical | PASS |
| TC-S016 | Nested JSON | POST /getfeeLnDiscountNew | 100x nested | Status < 500 | High | FAIL |
| TC-S017 | Large payload 1MB | POST /getfeeLnDiscountNew | 1MB customerid | Status < 500 | Medium | PASS |
| TC-S018 | Stack trace leak | POST /getfeeLnDiscountNew | weight: -999 | No stack trace | High | PASS |
| TC-S019 | Server header leak | POST /getfeeLnDiscountNew | - | No version leak | Medium | PASS |
| TC-S020 | CORS check | POST /getfeeLnDiscountNew | Origin: evil.com | No wildcard CORS | High | PASS |
| TC-E2E001 | Domestic small package | POST /getfeeLnDiscountNew | 500g domestic | Status 200, data | High | PASS |
| TC-E2E002 | International MY | POST /getfeeLnDiscountNew | 2000g MY | Status 200, data | High | PASS |
| TC-E2E003 | Heavy package 15kg | POST /getfeeLnDiscountNew | 15000g | Status 200, data | Medium | PASS |
| TC-E2E004 | Cylindrical package | POST /getfeeLnDiscountNew | diameter: 15 | Status 200, data | Medium | PASS |
| TC-E2E005 | Sequential 3 pkgs | POST /getfeeLnDiscountNew | 3 different | All status 200 | High | PASS |
| TC-E2E006 | Weight comparison | POST /getfeeLnDiscountNew | 1000 vs 30000 | Data berbeda | Medium | PASS |
| TC-E2E007 | Domestic vs Intl | POST /getfeeLnDiscountNew | 10110 vs MY | Data berbeda | Medium | PASS |
| TC-E2E008 | Health check | POST /getfeeLnDiscountNew | - | Status < 500, < 5s | High | PASS |
| TC-E2E009 | Timeout handling | POST /getfeeLnDiscountNew | timeout 10s | Graceful timeout | Medium | PASS |
| TC-PF001 | Baseline < 2s | POST /getfeeLnDiscountNew | - | Duration < 2000ms | High | PASS |
| TC-PF002 | 5 concurrent | POST /getfeeLnDiscountNew | 5 parallel | All < 5000ms | High | PASS |
| TC-PF003 | 10 sequential avg | POST /getfeeLnDiscountNew | 10 sequential | Avg < 2000ms | High | PASS |
| TC-PF004 | Consistency 3x | POST /getfeeLnDiscountNew | Same input 3x | Same structure | Medium | PASS |
| TC-PF005 | Payload comparison | POST /getfeeLnDiscountNew | Various payloads | All < 3000ms | Medium | PASS |
| TC-DV001 | Response JSON | POST /getfeeLnDiscountNew | Valid body | Content-Type: json | High | PASS |
| TC-DV002 | Parseable JSON | POST /getfeeLnDiscountNew | Valid body | JSON.parse OK | High | PASS |
| TC-DV003 | Tarif info present | POST /getfeeLnDiscountNew | Valid body | Ada field tarif | High | PASS |
| TC-DV004 | Type consistency | POST /getfeeLnDiscountNew | Same input 3x | Tipe data sama | Medium | PASS |
| TC-DV005 | Numeric = number | POST /getfeeLnDiscountNew | Valid body | Fee = number | Medium | PASS |
| TC-DV006 | Currency positif | POST /getfeeLnDiscountNew | Valid body | Fee >= 0 | Medium | PASS |
| TC-DV007 | Response not empty | POST /getfeeLnDiscountNew | Valid body | Object keys > 0 | Medium | PASS |
| TC-DV008 | Status 200 | POST /getfeeLnDiscountNew | Valid body | Status = 200 | High | PASS |
| TC-DV009 | Headers lengkap | POST /getfeeLnDiscountNew | Valid body | Content-Type ada | Medium | PASS |
| TC-DV010 | Zip combos | POST /getfeeLnDiscountNew | 5 combos | All < 500 | Medium | PASS |
