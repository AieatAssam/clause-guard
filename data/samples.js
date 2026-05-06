/**
 * Sample contracts from well-known companies.
 * These are representative examples based on common industry patterns — not verbatim copies
 * of any specific company's current legal terms. They illustrate the types of clauses
 * ClauseGuard can detect. Always review actual contracts with a qualified attorney.
 */

const SAMPLE_CONTRACTS = [
  {
    name: 'Adobe Creative Cloud',
    company: 'Adobe',
    icon: '🎨',
    description: 'SaaS subscription — auto-renewal, broad indemnity, no refunds',
    text: `ADOBE CREATIVE CLOUD SUBSCRIPTION AGREEMENT

This is a binding legal agreement between you and Adobe Inc. ("Adobe").

1. SUBSCRIPTION TERM AND AUTO-RENEWAL
Your subscription will automatically renew at the end of each subscription period unless you cancel at least 30 days before the renewal date. If you fail to cancel within this window, your subscription will be renewed for an additional period at then-current pricing. Adobe will charge the payment method you provided at the time of renewal. All fees are non-refundable except as expressly stated in this agreement.

2. LICENSE GRANT AND RESTRICTIONS
Adobe grants you a non-exclusive, non-transferable, revocable license to use the software for your personal or internal business purposes. You may not assign, sublicense, or transfer your subscription or any rights hereunder without Adobe's prior written consent. Any unauthorized use will result in immediate termination of your license.

3. INDEMNIFICATION
You agree to indemnify, defend, and hold Adobe, its affiliates, officers, directors, employees, and agents harmless from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of the software, your violation of this agreement, or your infringement of any third-party rights.

4. LIMITATION OF LIABILITY
IN NO EVENT SHALL ADOBE BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR LOSS OF DATA, WHETHER BASED ON CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE. ADOBE'S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM. THIS LIMITATION SHALL NOT APPLY TO YOUR INDEMNIFICATION OBLIGATIONS.

5. DISPUTE RESOLUTION
Any dispute arising out of this agreement shall be resolved exclusively by binding arbitration in San Jose, California. You waive your right to participate in a class action or class arbitration. This agreement shall be governed by the laws of the State of California.

6. MODIFICATION OF TERMS
Adobe may modify these terms at any time by posting updated terms on its website. Your continued use of the software after the effective date of any modification constitutes acceptance of the modified terms.

7. TERMINATION
Adobe may terminate this agreement immediately if you breach any provision. Upon termination, all rights granted to you immediately cease and you must destroy all copies of the software. Sections 3, 4, and 5 shall survive termination.`,

    expectedFlags: ['auto-renew', 'non-refundable-fees', 'unilateral-assignment', 'broad-indemnity', 'no-consequential-damages-narrow', 'mandatory-arbitration', 'class-action-waiver', 'choice-of-law-unfavorable', 'no-cure-period', 'unilateral-modification', 'work-for-hire-default'],
  },

  {
    name: 'Airbnb Terms of Service',
    company: 'Airbnb',
    icon: '🏠',
    description: 'Platform marketplace — mandatory arbitration, class action waiver, broad indemnity',
    text: `AIRBNB TERMS OF SERVICE

This agreement is between you ("User") and Airbnb, Inc.

1. DISPUTE RESOLUTION AND ARBITRATION
Any dispute, claim, or controversy arising out of or relating to this Agreement or the Airbnb Services shall be resolved exclusively by binding arbitration administered by the American Arbitration Association. The arbitration shall be held in San Francisco, California. YOU AGREE THAT ANY ARBITRATION SHALL BE CONDUCTED ON AN INDIVIDUAL BASIS AND NOT AS A CLASS ACTION OR CONSOLIDATED ACTION. YOU EXPRESSLY WAIVE YOUR RIGHT TO PARTICIPATE IN ANY CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.

2. USER INDEMNIFICATION
You agree to indemnify, defend, and hold harmless Airbnb, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of the Services, your Content, your violation of these Terms, or your interaction with any other User.

3. LIMITATION OF LIABILITY
IN NO EVENT SHALL AIRBNB BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF REVENUE, OR LOSS OF BUSINESS. AIRBNB'S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM.

4. MODIFICATION OF TERMS
Airbnb reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Services after any modification constitutes acceptance of the modified Terms.

5. ASSIGNMENT
Airbnb may assign this Agreement without your prior written consent to any affiliate or in connection with any merger, reorganization, acquisition, or sale of all or substantially all of its assets. You may not assign this Agreement without Airbnb's prior written consent.

6. TERMINATION
Airbnb may terminate this Agreement and your access to the Services at any time for any reason without prior notice. Sections 2, 3, and 7 shall survive any termination.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California, without regard to its conflict of laws provisions.

8. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between you and Airbnb and supersedes all prior agreements, representations, and understandings, whether written or oral. You acknowledge that you have not relied upon any representations not expressly set forth herein.`,

    expectedFlags: ['mandatory-arbitration', 'class-action-waiver', 'broad-indemnity', 'no-consequential-damages-narrow', 'unilateral-modification', 'unilateral-assignment', 'termination-for-convenience-one-sided', 'survival-all-obligations', 'choice-of-law-unfavorable', 'entire-agreement-waiver'],
  },

  {
    name: 'Uber Driver Agreement',
    company: 'Uber',
    icon: '🚗',
    description: 'Gig economy — independent contractor, mandatory arbitration, non-compete',
    text: `UBER DRIVER PLATFORM AGREEMENT

This Agreement is between you ("Driver") and Uber Technologies Inc. ("Uber").

1. INDEPENDENT CONTRACTOR STATUS
Driver is an independent contractor and not an employee, agent, joint venturer, or partner of Uber. Driver is solely responsible for all taxes, benefits, and expenses. Nothing in this Agreement creates an employment relationship between Driver and Uber. Driver retains sole discretion over when, where, and how to provide services.

2. EXCLUSIVITY AND NON-COMPETE
During the term of this Agreement and for twelve (12) months thereafter, Driver shall not, directly or indirectly, provide services that are substantially similar to the Services to any competitor of Uber in any geographic area where Uber operates. Driver acknowledges that breach of this provision would cause irreparable harm and Uber shall be entitled to injunctive relief without the necessity of posting bond.

3. DISPUTE RESOLUTION
Any dispute arising out of this Agreement shall be resolved exclusively through binding arbitration in San Francisco, California. Driver waives any right to participate in a class action or representative proceeding. All arbitration costs shall be borne equally, provided that if Driver prevails, Uber shall reimburse Driver's share. This Agreement shall be governed by the laws of the State of California, without regard to conflict of laws. The parties waive any right to a jury trial.

4. INDEMNIFICATION
Driver agrees to indemnify, defend, and hold Uber harmless from any and all claims, losses, damages, and expenses (including reasonable legal fees) arising from Driver's performance of Services, including but not limited to claims involving personal injury, property damage, or violation of law.

5. RATE MODIFICATION
Uber reserves the right to modify pricing, fees, and commission rates at any time upon notice. Driver's continued use of the Platform following any rate change constitutes acceptance of the new rates.

6. TERMINATION
Either party may terminate this Agreement at any time for convenience. Uber may terminate this Agreement immediately if Driver breaches any provision. Upon termination, Driver shall immediately cease using the Platform.

7. ASSIGNMENT
Driver may not assign this Agreement or any rights hereunder. Uber may assign this Agreement at any time without notice.

8. CLASS ACTION WAIVER
DRIVER AGREES TO BRING ANY CLAIMS AGAINST UBER ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION.`,

    expectedFlags: ['overbroad-noncompete', 'confidentiality-injunction', 'mandatory-arbitration', 'class-action-waiver', 'choice-of-law-unfavorable', 'waiver-of-jury-trial', 'broad-indemnity', 'unilateral-modification', 'termination-for-convenience-one-sided', 'no-cure-period', 'anti-assignment', 'unilateral-assignment'],
  },

  {
    name: 'Amazon Associates Program',
    company: 'Amazon',
    icon: '📦',
    description: 'Affiliate program — termination for convenience, broad modification rights, no refunds',
    text: `AMAZON ASSOCIATES PROGRAM OPERATING AGREEMENT

This Agreement is between you ("Associate") and Amazon Services LLC ("Amazon").

1. TERM AND TERMINATION
The term of this Agreement begins upon your acceptance and continues until terminated by either party. Either party may terminate this Agreement at any time, with or without cause, upon notice. Amazon may terminate this Agreement immediately without notice if you violate any provision. Upon termination, all fees payable to you shall be forfeited and no further fees shall accrue.

2. MODIFICATION OF AGREEMENT
Amazon may modify any provision of this Agreement at any time by posting the modified terms on the Associates Program website. Your continued participation in the Program after the effective date of any modification constitutes your binding acceptance of the modified terms. Amazon may modify the Fee Schedule at any time without notice.

3. FEE PAYMENT
Amazon shall pay Associate referral fees as set forth in the Fee Schedule. Amazon reserves the right to withhold payment if Amazon determines that any of your referrals resulted from prohibited activities. Fees are payable only upon Amazon's receipt of payment from the referred customer. Amazon makes no guarantee as to the amount of fees payable.

4. INDEMNIFICATION
Associate agrees to indemnify and hold Amazon harmless from any and all claims, damages, and expenses arising from Associate's participation in the Program, Associate's Site content, or Associate's breach of this Agreement.

5. DISCLAIMER OF WARRANTIES
THE PROGRAM AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." AMAZON MAKES NO WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

6. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements. Associate acknowledges that it has not relied on any statements not contained in this Agreement.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Washington.

8. LIMITATION OF LIABILITY
IN NO EVENT SHALL AMAZON BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES.`,

    expectedFlags: ['termination-for-convenience-one-sided', 'no-cure-period', 'unilateral-modification', 'pay-when-paid', 'broad-indemnity', 'as-is-warranty', 'entire-agreement-waiver', 'choice-of-law-unfavorable', 'no-consequential-damages-narrow'],
  },

  {
    name: 'Apple Developer Agreement',
    company: 'Apple',
    icon: '🍎',
    description: 'Developer platform — non-disclosure, non-compete, unilateral changes, indemnity',
    text: `APPLE DEVELOPER PROGRAM LICENSE AGREEMENT

This Agreement is between you ("Developer") and Apple Inc. ("Apple").

1. CONFIDENTIALITY
Developer agrees to hold all Confidential Information in strict confidence and not to disclose it to any third party. Confidential Information includes all information disclosed by Apple to Developer. These obligations shall survive for a period of five (5) years from disclosure or, for trade secrets, for so long as such information remains a trade secret. Developer acknowledges that breach of this provision would cause irreparable harm and Apple shall be entitled to injunctive relief.

2. LICENSE GRANT
Apple grants Developer a non-exclusive, non-transferable, non-sublicensable, revocable license to use the Apple Software solely for the purposes of developing and testing applications for Apple-branded products. Developer shall not assign or transfer this license without Apple's express written consent.

3. APP REVIEW AND REJECTION
Apple retains sole discretion to reject, remove, or not distribute any application submitted to the App Store. Apple may remove or suspend distribution of applications at any time for any reason.

4. INDEMNIFICATION
Developer agrees to indemnify, defend, and hold Apple harmless from any and all third-party claims arising from Developer's applications, including claims of intellectual property infringement.

5. NO WARRANTY
THE APPLE SOFTWARE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND.

6. LIMITATION OF LIABILITY
IN NO EVENT SHALL APPLE BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, OR SPECIAL DAMAGES. APPLE'S MAXIMUM LIABILITY SHALL NOT EXCEED FIFTY DOLLARS ($50).

7. MODIFICATION
Apple may modify this Agreement at any time. Developer's continued participation in the Program following any modification constitutes acceptance of the modified terms.

8. EXPORT RESTRICTIONS
Developer agrees to comply with all applicable export laws and not to export or re-export Apple Software to any prohibited countries or entities.

9. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California, without regard to its conflict of laws principles.`,

    expectedFlags: ['perpetual-confidentiality', 'confidentiality-injunction', 'overbroad-confidentiality', 'anti-assignment', 'unilateral-modification', 'broad-indemnity', 'as-is-warranty', 'no-consequential-damages-narrow', 'liability-cap-too-low', '$50'],
  },

  {
    name: 'Netflix Subscription Terms',
    company: 'Netflix',
    icon: '🎬',
    description: 'Consumer subscription — auto-renewal, price changes, termination at will, arbitration',
    text: `NETFLIX TERMS OF USE

This agreement governs your use of the Netflix service.

1. SUBSCRIPTION AND AUTO-RENEWAL
Your Netflix membership will continue and automatically renew until cancelled. You must cancel your membership at least 24 hours before your billing date to avoid being charged for the next billing period. We will charge the payment method you provided at the start of each billing period. All fees and charges are non-refundable except as required by applicable law.

2. PRICE CHANGES
We may change subscription prices at any time. We will provide you with notice of any price change, but your continued use of the service after the price change goes into effect constitutes your acceptance of the new price. If you do not agree to the price change, you may cancel your membership.

3. SERVICE MODIFICATION
Netflix may modify, suspend, or discontinue any aspect of the service at any time, including content availability, features, and functionality, with or without notice.

4. TERMINATION
We may terminate your membership at any time without notice for any reason, including if you breach these Terms. You may cancel your membership at any time. Upon termination, your right to use the service immediately ceases.

5. DISCLAIMER OF WARRANTIES
THE NETFLIX SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

6. LIMITATION OF LIABILITY
IN NO EVENT SHALL NETFLIX BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES. NETFLIX'S TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF THE AMOUNT PAID BY YOU IN THE PRECEDING TWELVE MONTHS OR ONE HUNDRED DOLLARS ($100).

7. DISPUTE RESOLUTION
Any dispute shall be resolved by binding individual arbitration. You and Netflix agree that any dispute resolution proceedings shall be conducted on an individual basis and not in a class action or consolidated action. You waive your right to a jury trial. This agreement is governed by the laws of the State of California.

8. ASSIGNMENT
Netflix may assign this agreement without your consent. You may not assign this agreement without Netflix's prior written consent.

9. ENTIRE AGREEMENT
This agreement constitutes the entire agreement between you and Netflix and supersedes all prior communications. You acknowledge that you have not relied on any representations not contained in this agreement.`,

    expectedFlags: ['auto-renew', 'non-refundable-fees', 'auto-price-increase', 'unilateral-modification', 'termination-for-convenience-one-sided', 'as-is-warranty', 'no-consequential-damages-narrow', 'mandatory-arbitration', 'class-action-waiver', 'waiver-of-jury-trial', 'choice-of-law-unfavorable', 'unilateral-assignment', 'entire-agreement-waiver'],
  },
];
