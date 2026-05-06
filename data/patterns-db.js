/**
 * Contract Clause Red-Flag Pattern Library
 * Tight, specific regex patterns to minimise false positives.
 * Each pattern targets distinctive red-flag language — NOT standard contract boilerplate.
 */
const RED_FLAG_PATTERNS = [

  // ============================================================
  // AUTO-RENEWAL
  // ============================================================
  {
    id: 'auto-renew-silent',
    category: 'Auto-Renewal',
    severity: 'critical',
    label: 'Silent / Negative-Consent Renewal',
    patterns: [
      /\b(?:shall\s+be\s+)?deemed\s+renewed\s+unless\b/i,
      /\bautomatically\s+renew(?:ed|s)?\s+for\s+(?:a\s+)?(?:subsequent|additional|successive|further)\s+term\b/i,
    ],
    description: `The contract auto-renews unless you actively opt out — by default you're locked in.`,
    whyRisky: `Missing a narrow opt-out window locks you in for another full term. Some contracts need notice 60+ days before expiry.`,
    askLawyer: `What's the exact notice deadline and method? Can we switch to mutual written renewal?`,
    suggestedFix: `"This Agreement expires at the end of its term unless both parties mutually agree in writing to extend."`,
    riskLevel: 9,
  },
  {
    id: 'auto-renew-notice-burden',
    category: 'Auto-Renewal',
    severity: 'high',
    label: 'Narrow Non-Renewal Window',
    patterns: [
      /\bnotice\s+of\s+(?:non-?renewal|cancellation|termination)\s+(?:within|no\s+later\s+than|at\s+least)\s+(\d+)\s+day/i,
      /\b(\d{2,3})\s+days?\s+(?:prior\s+to|before|preceding)\s+(?:the\s+)?(?:end\s+of\s+(?:the\s+)?(?:initial\s+)?term|renewal\s+date)\b/i,
      /\bevergreen\s+(?:clause|provision|clause)\b/i,
    ],
    description: `Contract renews automatically unless you notify them within a specific window well before expiry.`,
    whyRisky: `Many people forget the deadline. Even 60 days can be tight in a busy business cycle.`,
    askLawyer: `Can we shorten the notice window? Add a renewal reminder obligation? Allow mid-term termination?`,
    suggestedFix: `Add: "Provider shall send a renewal reminder at least 45 days before the notice deadline."`,
    riskLevel: 7,
  },

  // ============================================================
  // INDEMNIFICATION
  // ============================================================
  {
    id: 'broad-indemnity',
    category: 'Indemnification',
    severity: 'critical',
    label: 'Broad / One-Sided Indemnity',
    patterns: [
      /indemnif(?:y|ication).{0,40}?(?:any\s+and\s+all|all)\s+(?:claims?|damages?|loss(?:es)?|liabilit(?:y|ies))\s+(?:including\s+)?(?:without\s+limitation|arising\s+out\s+of|resulting\s+from)/i,
      /indemnif(?:y|ication).{0,40}?hold\s+(?:harmless|blameless)\b(?!\s*and\s+such\s+indemnification)/i,
    ],
    description: `You must pay ALL losses — even those partly caused by the other party. "Any and all" with "including without limitation" creates uncapped exposure.`,
    whyRisky: `Covers the other party's own negligence too. Usually unlimited and not subject to the liability cap.`,
    askLawyer: `Is it mutual? Limited to your negligence only? Capped?`,
    suggestedFix: `Make mutual, cap at contract value, exclude the other party's negligence.`,
    riskLevel: 9,
  },
  {
    id: 'indemnity-ip-defense',
    category: 'Indemnification',
    severity: 'high',
    label: 'IP Indemnity with Defense Obligation',
    patterns: [
      /(?:shall|will|agree\s+to)\s+(?:defend|indemnify).{0,30}?(?:any\s+)?(?:claim|allegation|action)\s+(?:of\s+)?(?:infring|misappropriation)/i,
      /\bdefend.{0,40}?indemnif/i,
    ],
    description: `You must defend AND indemnify against IP claims. "Defend" means you control and fund the defense.`,
    whyRisky: `Defense costs alone are massive even for baseless claims. "Defend" shifts full control to you at your expense.`,
    askLawyer: `Can we separate "defend" from "indemnify"? Is there a cap? Can you settle without consent?`,
    suggestedFix: `Change "defend and indemnify" to "indemnify". Cap at contract value.`,
    riskLevel: 8,
  },
  {
    id: 'indemnity-uncapped',
    category: 'Indemnification',
    severity: 'critical',
    label: 'Indemnity Carved Out of Liability Cap',
    patterns: [
      /(?:indemnif(?:ication)?|indemnity)\s+(?:obligations?|claims?)\s+(?:shall|will)\s+(?:not\s+be\s+)?(?:subject\s+to|limited\s+by)\b(?:\s+the\s+)?(?:limitation|cap)/i,
      /(?:limitation\s+of\s+liability|liability\s+cap).{0,80}?(?:shall\s+)?(?:not\s+)?apply\s+to.{0,20}?(?:indemnif|indemnity)/i,
    ],
    description: `Indemnity claims are specifically excluded from the contract's liability cap — they're unlimited.`,
    whyRisky: `A $10K contract with this clause exposes you to potentially unlimited indemnity claims.`,
    askLawyer: `Can we add a separate cap for indemnity claims?`,
    suggestedFix: `Add: "Total liability for indemnity claims shall not exceed [amount or multiplier of fees]."`,
    riskLevel: 9,
  },

  // ============================================================
  // LIMITATION OF LIABILITY
  // ============================================================
  {
    id: 'consequential-exclusion-only',
    category: 'Limitation of Liability',
    severity: 'medium',
    label: 'Broad Consequential Damages Exclusion',
    patterns: [
      /\bconsequential\s+(?:damages|loss)\b(?:.{0,10}?\b(?:lost\s+profits|loss\s+of\s+(?:revenue|business|data|opportunity))\b)?/i,
      /\bIN\s+NO\s+EVENT\s+(?:SHALL|WILL)\s+(?:.{0,60}?)\s?BE\s+LIABLE\s+FOR\s+(?:ANY|CONSEQUENTIAL)\b.{0,30}?DAMAGES\b/i,
    ],
    description: `No liability for consequential/indirect damages — covers lost profits, lost revenue, lost data.`,
    whyRisky: `The biggest losses in a dispute are typically consequential. Combined with a low cap, you recover almost nothing.`,
    askLawyer: `Are there carve-outs for confidentiality breach, IP infringement, fraud, data breach?`,
    suggestedFix: `Add exceptions for: breach of confidentiality, IP infringement, data breach, fraud, willful misconduct.`,
    riskLevel: 6,
  },
  {
    id: 'liability-cap-low',
    category: 'Limitation of Liability',
    severity: 'medium',
    label: 'Low Aggregate Liability Cap',
    patterns: [
      /(?:aggregate|total|maximum)\s+(?:liability|damages)\s+(?:shall|is|will)\s+(?:not\s+)?exceed\s+(?:the\s+)?(?:fees\s+(?:paid|payable)|(?:US?\$)?\d{1,4}(?:[.,]\d+)?(?:\s*(?:k|K|thousand|million|M))?)\b/i,
    ],
    description: `Total liability is capped at fees paid or a low fixed amount (e.g. $50–$1,000).`,
    whyRisky: `For a small contract, the cap may be far below the actual harm they could cause.`,
    askLawyer: `Is the cap reciprocal? Does it reflect actual risk exposure?`,
    suggestedFix: `Negotiate to 6-12 months of fees or applicable insurance limits.`,
    riskLevel: 5,
  },

  // ============================================================
  // ASSIGNMENT
  // ============================================================
  {
    id: 'unilateral-assignment',
    category: 'Assignment',
    severity: 'high',
    label: 'One-Sided Assignment Right',
    patterns: [
      /(?:may|can|reserv(?:e|es|ed)\s+the\s+right\s+to)\s+assign\s+(?:this\s+)?(?:agreement|contract).{0,50}?(?:without\s+(?:your|the\s+other|prior|our)\s+(?:written\s+)?(?:consent|approval))/i,
      /\byou\s+(?:may\s+)?not\s+assign\b.{0,50}?\b(?:we|company|provider)\s+(?:may|can)\s+assign\b/i,
    ],
    description: `One party can assign the contract without consent but you cannot. Or they can assign to affiliates or in a merger without notice.`,
    whyRisky: `Your contract could end up with a competitor, different jurisdiction, or financially unstable entity.`,
    askLawyer: `Is assignment entirely mutual? Can consent be unreasonably withheld?`,
    suggestedFix: `"Neither party may assign without the other's written consent, not to be unreasonably withheld."`,
    riskLevel: 7,
  },

  // ============================================================
  // DISPUTE RESOLUTION
  // ============================================================
  {
    id: 'class-action-waiver',
    category: 'Dispute Resolution',
    severity: 'high',
    label: 'Class Action / Collective Waiver',
    patterns: [
      /\bwaive\s+(?:any\s+)?(?:right\s+to\s+)?(?:a\s+)?(?:class\s+action|class\s+arbitration)\b/i,
      /\bnot\s+(?:bring|join|participate\s+in)\s+(?:a\s+)?(?:class\s+action|class\s+arbitration)\b/i,
      /(?:arbitration|claims?)\s+(?:shall\s+)?be\s+(?:conducted|brought|resolved)\s+(?:on\s+)?(?:an\s+)?individual\s+(?:basis|claim)/i,
    ],
    description: `Forces all claims to be brought individually — no class actions or aggregated claims.`,
    whyRisky: `For small-value claims, individual action costs more than the claim is worth. This effectively immunises the company from low-value widespread issues.`,
    askLawyer: `Is this enforceable in your jurisdiction? Is there a minimum claim carve-out?`,
    suggestedFix: `Either remove entirely or add: "This shall not apply to claims that cannot, as a matter of law, be waived."`,
    riskLevel: 8,
  },
  {
    id: 'arbitration-unilateral-venue',
    category: 'Dispute Resolution',
    severity: 'high',
    label: 'Arbitration in Inconvenient Venue',
    patterns: [
      /\barbitration\b.{0,50}(?:in\s+)?(?:the\s+)?(?:City\s+of\s+)?(?:San\s+Francisco|New\s+York|Los\s+Angeles|Chicago|Delaware|London|Singapore|Hong\s+Kong|Sydney|Toronto|Dublin|Amsterdam)\b/i,
    ],
    description: `Any dispute must be arbitrated in a specific city — usually the company's HQ city, far from you.`,
    whyRisky: `Arbitration in a distant city makes it prohibitively expensive to bring a claim, effectively waiving your legal recourse.`,
    askLawyer: `Can the venue be changed to your location? Or remote arbitration?`,
    suggestedFix: `"Arbitration shall be held in [your city] or via video conference at the claimant's option."`,
    riskLevel: 8,
  },
  {
    id: 'short-limitation-period',
    category: 'Dispute Resolution',
    severity: 'medium',
    label: 'Shortened Claim Period',
    patterns: [
      /\b(?:any|all)\s+(?:action|claim|suit|proceeding)\s+(?:arising|with\s+respect\s+to).{0,60}?\s+(?:within|no\s+later\s+than)\s+([1-9]|1[0-2])\s+(?:month|year)\b(?!\s+(?:after\s+)?(?:the\s+)?(?:expiration|termination))/i,
    ],
    description: `You must bring any claim within 6-12 months — far shorter than the standard 3-6 year statute of limitations.`,
    whyRisky: `Some issues (IP infringement, latent defects) may not be discoverable within that window.`,
    askLawyer: `Can the period be extended to at least 2 years, with a carve-out for latent defects?`,
    suggestedFix: `Extend to 2 years. Add: "This period shall not apply to claims that could not reasonably be discovered within it."`,
    riskLevel: 6,
  },

  // ============================================================
  // TERMINATION
  // ============================================================
  {
    id: 'termination-unilateral-no-cause',
    category: 'Termination',
    severity: 'high',
    label: 'Unilateral Termination Without Cause (You Pay)',
    patterns: [
      /\b(?:may|can|reserv(?:e|es|ed)\s+the\s+right\s+to)\s+terminat(?:e|ion)\s+(?:this\s+)?(?:agreement|contract)\s+(?:at\s+)?(?:any\s+time|for\s+convenience|without\s+cause|with\s+or\s+without\s+cause)\b.{0,100}?\b(?:you|client|customer)\s+(?:shall|will|must)\s+(?:pay|ow)/i,
      /\byou\s+(?:may|can)\s+terminate.{0,100}?\b(?:we|company|provider)\s+(?:may|can)\s+terminate.{0,60}?\b(?:immediately|without\s+notice)\b/i,
    ],
    description: `The other party can walk away at any time without cause, but you still owe payment or penalties.`,
    whyRisky: `After you've invested in setup/onboarding, they can terminate and you get nothing — or worse, owe money.`,
    askLawyer: `Is termination-for-convenience mutual? What about work-in-progress payment?`,
    suggestedFix: `"Either party may terminate for convenience with 60 days notice. The terminating party pays for all work completed through termination."`,
    riskLevel: 7,
  },
  {
    id: 'no-cure-period',
    category: 'Termination',
    severity: 'high',
    label: 'Immediate Termination Without Cure',
    patterns: [
      /\bterminat(?:e|ion)\s+(?:this\s+)?(?:agreement|contract)\s+(?:immediately|at\s+once|forthwith)\s+(?:upon|after|if)\b(?!.{0,30}?(?:shall\s+(?:have|be\s+entitled\s+to)|provided\s+(?:with\s+)?(?:a\s+)?(?:cure|opportunity\s+to\s+cure)))/i,
      /\b(?:shall\s+)?not\s+(?:be\s+)?(?:entitled|allowed)\s+(?:to\s+)?(?:a\s+)?(?:cure|cure\s+period|opportunity\s+to\s+cure)\b/i,
    ],
    description: `The other party can terminate immediately on breach with no chance to fix it.`,
    whyRisky: `Even minor issues (a payment delayed by the bank) could trigger termination.`,
    askLawyer: `Can we add a 30-day cure period for all breaches except non-payment?`,
    suggestedFix: `"For any breach, the breaching party has 30 days from written notice to cure before termination."`,
    riskLevel: 7,
  },
  {
    id: 'ip-transfer-on-termination',
    category: 'Termination',
    severity: 'critical',
    label: 'IP Assignment Upon Termination Unpaid',
    patterns: [
      /\b(?:upon|on)\s+(?:termination|expiration).{0,60}?\byou\s+(?:shall|will|must|agree\s+to)\s+(?:assign|transfer|convey|deliver).{0,40}?(?:intellectual\s+property|IP|work\s+product|deliverables)\b(?!.{0,80}?(?:paid|compensated))/i,
    ],
    description: `You must transfer all work product to them upon termination — even if they haven't paid you for it.`,
    whyRisky: `You lose your IP and your time. You have no leverage to get paid for work already done.`,
    askLawyer: `Does payment for completed work come before IP transfer? What about your pre-existing IP?`,
    suggestedFix: `"Developer shall deliver work product only after receiving payment for completed work. Pre-existing IP remains Developer's."`,
    riskLevel: 9,
  },

  // ============================================================
  // PAYMENT TERMS
  // ============================================================
  {
    id: 'pay-if-paid',
    category: 'Payment Terms',
    severity: 'critical',
    label: 'Pay-If-Paid / Pay-When-Paid',
    patterns: [
      /\b(?:payable|payment|paid)\b.{0,30}?(?:when|upon|if|only\s+if|conditional\s+(?:upon|on))\s+(?:(?:our|your|the)\s+)?(?:receipt|collection)\s+(?:of|from)\b/i,
      /\bno\s+(?:obligation|liability)\s+(?:to\s+)?pay\s+(?:until|unless|except)\b.{0,60}?\b(?:paid|received|collected)\b/i,
      /\bpay-when-paid\b|\bpay-if-paid\b/i,
    ],
    description: `You only get paid if and when the other party gets paid by THEIR client. All credit risk is yours.`,
    whyRisky: `You do the work but your payment depends on someone else paying them first. If their client doesn't pay, neither do you.`,
    askLawyer: `Is this enforceable in your jurisdiction? (Some ban these clauses). Can we change to unconditional net terms?`,
    suggestedFix: `Remove entirely. "Client's obligation to pay is absolute and not contingent on any third-party payment."`,
    riskLevel: 9,
  },
  {
    id: 'price-increase-notice-only',
    category: 'Payment Terms',
    severity: 'high',
    label: 'Unilateral Price Increase (Notice Only)',
    patterns: [
      /\breserv(?:e|es|ed)\s+(?:the\s+)?right\s+to\s+(?:change|modify|increase|adjust)\s+(?:fees?|price|rate|pricing|subscription)\s+(?:at\s+)?(?:any\s+time|upon\s+notice)\b/i,
      /(?:price|fee|rate)\s+(?:adjustment|increase|escalation)\s+(?:clause|provision)\s+.{0,30}?\binflation\b|CPI|RPI|index/i,
    ],
    description: `They can raise prices at any time with mere notice — no negotiation, no right to refuse.`,
    whyRisky: `In high-inflation periods, annual increases tied to CPI could be 8-10%+. No ability to object without cancelling.`,
    askLawyer: `Is there a cap? Can you terminate without penalty if you don't accept the increase?`,
    suggestedFix: `"Price increases capped at the lower of CPI and 5% annually. Customer may terminate without penalty within 30 days of any increase."`,
    riskLevel: 7,
  },

  // ============================================================
  // INTELLECTUAL PROPERTY
  // ============================================================
  {
    id: 'non-refundable-fees',
    category: 'Payment Terms',
    severity: 'medium',
    label: 'All Fees Non-Refundable',
    patterns: [
      /\b(?:all|any)\s+fees?\s.{0,20}?(?:are|shall\s+be|will\s+be)\s+(?:non-?refundable|nonrefundable)\b/i,
      /\bnon-?refundable\s+(?:fee|deposit|payment|retainer)\b/i,
    ],
    description: `All fees paid are non-refundable, regardless of whether the service is delivered.`,
    whyRisky: `If the other party breaches or never delivers the service, they may still keep your money.`,
    askLawyer: `Are there exceptions for prepaid but undelivered services?`,
    suggestedFix: `"Fees for services actually rendered are non-refundable. Prepaid fees for services not yet rendered shall be refunded."`,
    riskLevel: 5,
  },
  {
    id: 'work-for-hire-all',
    category: 'Intellectual Property',
    severity: 'critical',
    label: 'Work-for-Hire / Total IP Assignment',
    patterns: [
      /\bwork\s+(?:made\s+)?for\s+hire\b/i,
      /\ball\s+(?:works?|deliverables|product(?:s)?)\s+(?:shall\s+)?(?:be\s+)?(?:the\s+)?sole\s+(?:and\s+)?exclusive\s+property\b/i,
      /\birrevocably\s+(?:assign|transfer|convey)\s+(?:and\s+)?(?:agree\s+to\s+)?assign\b/i,
    ],
    description: `Everything you create is automatically their property, classified as "work made for hire."`,
    whyRisky: `This can cover your methods, tools, and pre-existing IP incorporated into the work — not just the final deliverables. You may lose rights to reuse your own code/templates.`,
    askLawyer: `Is pre-existing IP excluded? Is assignment limited to "deliverables specifically created for this project"?`,
    suggestedFix: `"Assignment is limited to deliverables specifically created and paid for. Developer retains all pre-existing IP, tools, and libraries."`,
    riskLevel: 9,
  },
  {
    id: 'grant-back-broad',
    category: 'Intellectual Property',
    severity: 'critical',
    label: 'Grant-Back License (Your IP, Their Use)',
    patterns: [
      /(?:grants?|granted)\s+(?:to\s+)?(?:the\s+)?(?:client|company).{0,30}?(?:perpetual|irrevocable|worldwide|royalty-?free).{0,70}?license/i,
      /\bretains?\s+(?:ownership|title|rights?)\s+(?:of|to|in)\s+(?:all\s+)?(?:IP|intellectual\s+property|technology)\s+(?:but|and)\s+grants?\b/i,
    ],
    description: `You keep ownership of your pre-existing IP, but you grant them a broad license to use it — perpetual, irrevocable, possibly sublicensable.`,
    whyRisky: `"Sublicensable" means they can let others use your tools. "For any purpose" means they could use your methods to compete with you.`,
    askLawyer: `Is the license limited to the project scope? Non-sublicensable? Revocable on termination?`,
    suggestedFix: `"Client receives a non-exclusive, non-sublicensable license to use Developer's IP solely as incorporated in and necessary to use the deliverables."`,
    riskLevel: 8,
  },

  // ============================================================
  // CONFIDENTIALITY & DATA
  // ============================================================
  {
    id: 'nda-no-exclusions',
    category: 'Confidentiality',
    severity: 'high',
    label: 'NDA Without Standard Exclusions',
    patterns: [
      /confidential\s+information\s+(?:shall\s+)?(?:include|cover|mean)\s+(?:any\s+and\s+all|all)\s+(?:information|data|material)\s+(?:disclosed|shared|provided)\b(?!.{0,200}?(?:public|known\s+to\s+(?:the\s+)?(?:receiving|recipient)\s+(?:party|already)|independently\s+developed))/i,
    ],
    description: `Confidential Information is defined so broadly it covers everything, with no standard exclusions for publicly known or independently developed information.`,
    whyRisky: `Standard exclusions are necessary — otherwise you could be bound to secrecy about things you already knew or developed yourself before the NDA.`,
    askLawyer: `Are the four standard NDA exclusions present? (known prior, public, independently developed, third-party source)`,
    suggestedFix: `Add: "Confidential Information excludes info that (a) is public, (b) was known to recipient before disclosure, (c) is independently developed, or (d) is received from a third party without restriction."`,
    riskLevel: 7,
  },
  {
    id: 'confidentiality-perpetual',
    category: 'Confidentiality',
    severity: 'high',
    label: 'Perpetual Confidentiality (No Time Limit)',
    patterns: [
      /\b(?:shall|will)\s+(?:survive|continue|remain\s+in\s+effect)\s+(?:indefinitely|in\s+perpetuity|for\s+an\s+unlimited\s+period|forever)\b/i,
    ],
    description: `Confidentiality obligations never expire — they last forever.`,
    whyRisky: `Most business information becomes stale in 2-5 years. Perpetual obligations are burdensome and often unenforceable for non-trade-secret info.`,
    askLawyer: `Can we set a 3-5 year limit for general confidential info, with trade secrets protected until they lose that status?`,
    suggestedFix: `"Confidentiality obligations for non-trade-secret info survive for 3 years. Trade secrets protected until they lose that status."`,
    riskLevel: 6,
  },

  // ============================================================
  // NON-COMPETE & NON-SOLICIT
  // ============================================================
  {
    id: 'overbroad-noncompete',
    category: 'Non-Compete / Non-Solicit',
    severity: 'critical',
    label: 'Broad Non-Compete (Geography + Duration)',
    patterns: [
      /\b(?:non-?compete|noncompete)\b.{0,60}?\b(\d+)\s+(?:month|year|years?)\b/i,
      /\b(?:(?:shall|will)\s+not\s+|agree(?:s)?\s+not\s+(?:to\s+)?)(?:directly\s+or\s+indirectly)\s+(?:own|manage|operate|invest\s+in|be\s+employed\s+by|consult).{0,60}?\bcompetitor\b/i,
      /\b(?:for\s+)?(\d+)\s+(?:months?|years?)\s+(?:after|following|subsequent\s+to).{0,40}?\b(?:compete|solicit|engage)\b/i,
    ],
    description: `Restricts you from working with competitors for a defined period (often 6-24 months) after the contract ends.`,
    whyRisky: `Can prevent you from working in your entire field. Enforceability varies by jurisdiction (illegal in California, restricted in UK/EU). Even if unenforceable, used to intimidate.`,
    askLawyer: `Is it enforceable in your jurisdiction? Can it be narrowed to a specific competitor list and geography?`,
    suggestedFix: `Limit to 3-6 months, specific named competitors, and a defined geographic radius. Better: convert to a client non-solicit.`,
    riskLevel: 9,
  },
  {
    id: 'employee-non-solicit-broad',
    category: 'Non-Compete / Non-Solicit',
    severity: 'medium',
    label: 'Overbroad Non-Solicit (All Employees)',
    patterns: [
      /(?:shall|will)\s+not\s+(?:solicit|hire|recruit|induce)|agree\s+not\s+(?:to\s+)?(?:solicit|hire|recruit|induce)\s+(?:any\s+)?(?:employee|contractor|personnel|staff|worker)\s+(?:of|from)\s+(?:the\s+)?(?:company|client|customer|other\s+party)\b/i,
    ],
    description: `You cannot hire or solicit ANY of their employees — not just those you worked with.`,
    whyRisky: `Could prevent you from hiring anyone who ever worked there. "Indirectly" hiring via an agency could also be caught.`,
    askLawyer: `Is it limited to employees you materially interacted with? Is there a general solicitation exception?`,
    suggestedFix: `"Party shall not directly solicit employees with whom they had material contact during the engagement. General solicitations not specifically targeted are permitted."`,
    riskLevel: 5,
  },

  // ============================================================
  // WARRANTIES
  // ============================================================
  {
    id: 'as-is-no-warranty',
    category: 'Warranties',
    severity: 'high',
    label: '"AS IS" — All Warranties Disclaimed',
    patterns: [
      /(?:services?\s+are\s+)?(?:provided\s+|made\s+available\s+)?(?:on\s+an?\s+)?["'""]?(?:AS\s+IS|as-?is)["'""]?\s*(?:,?\s*and\s+(?:any\s+)?(?:warrant|all\s+warranties?\s+are\s+disclaimed))?/i,
      /(?:disclaim|exclude|negate)\s+(?:any\s+and\s+all\s+)?(?:warrant(?:y|ies)|conditions?).{0,40}?(?:merchantability|fitness\s+for\s+(?:a\s+)?particular\s+purpose|non-?infringement)/i,
    ],
    description: `The service is provided "as is" with NO warranties — no guarantee it works, is fit for purpose, or doesn't infringe IP.`,
    whyRisky: `If the service is defective, you have no recourse. No merchantability, no fitness, no non-infringement warranty. Common in software but dangerous for paid services.`,
    askLawyer: `Can we add even a minimal warranty (e.g., "services will be performed in a professional manner")?`,
    suggestedFix: `"Provider warrants services will be performed in a professional manner per industry standards. Remedy: re-performance or refund."`,
    riskLevel: 7,
  },

  // ============================================================
  // FORCE MAJEURE
  // ============================================================
  {
    id: 'force-majeure-payment-only',
    category: 'Force Majeure',
    severity: 'high',
    label: 'Force Majeure Excuses Them, Not Your Payment',
    patterns: [
      /force\s+majeure.{0,80}?(?:payment\s+obligations?\s+(?:shall|are)\s+(?:not\s+)?(?:be\s+)?(?:excused|suspended)|not\s+(?:be\s+)?excuse(?:d)?)/i,
    ],
    description: `Force majeure lets them stop providing services during unexpected events, but you still have to pay.`,
    whyRisky: `You're paying for nothing during the force majeure period. Creates a one-sided advantage.`,
    askLawyer: `Is force majeure mutual? Are payment obligations suspended proportionally?`,
    suggestedFix: `"Payment obligations shall be proportionately reduced for any period services are not received due to force majeure."`,
    riskLevel: 7,
  },

  // ============================================================
  // SURVIVAL
  // ============================================================
  {
    id: 'survival-indefinite',
    category: 'Survival',
    severity: 'medium',
    label: 'Indefinite Survival of All Obligations',
    patterns: [
      /\b(?:shall|will)\s+(?:survive|continue|remain\s+in\s+(?:full\s+)?(?:force|effect)).{0,60}?(?:indefinitely|in\s+perpetuity|perpetually|forever|for\s+an\s+unlimited\s+period)\b(?!.{0,80}?\b(?:trade\s+secret|proprietary\s+information))/i,
    ],
    description: `All obligations survive termination indefinitely — not just standard ones like confidentiality or indemnity, but everything.`,
    whyRisky: `You could be bound forever by terms that should naturally expire. Reasonable survival periods vary per clause.`,
    askLawyer: `Which specific sections survive and for how long? Are the periods tied to each obligation's purpose?`,
    suggestedFix: `Specify per-section: e.g., "Confidentiality survives 3 years. Indemnity survives statute of limitations. Payment survives until satisfied."`,
    riskLevel: 5,
  },

  // ============================================================
  // AUDIT RIGHTS
  // ============================================================
  {
    id: 'audit-at-your-cost',
    category: 'Audit Rights',
    severity: 'high',
    label: 'Unlimited Audit Rights (At Your Cost)',
    patterns: [
      /\baudit\b.{0,60}?\b(?:at\s+(?:your|the\s+)?(?:cost|expense)|(?:cost|expense)\s+(?:of|to\s+be\s+(?:borne|paid)\s+by)\s+(?:you|the\s+(?:licensee|contractor|provider)))\b/i,
      /\bright\s+(?:to\s+)?(?:audit|inspect|examine)\s+(?:all|any)\s+(?:your\s+)?(?:books?|records?|accounts?|systems?)\s+(?:at\s+)?(?:any\s+time|upon\s+demand)\b/i,
    ],
    description: `The other party can audit your records at any time, and you pay for it — deducted from your fees.`,
    whyRisky: `Unlimited audits can be used as harassment. At your expense, you're paying them to audit you. No frequency limit means constant disruption.`,
    askLawyer: `Is there a frequency limit (max 1 per year)? Who pays? Is there a threshold before you reimburse costs?`,
    suggestedFix: `"Max 1 audit per 12 months, at [auditor]'s expense. If audit reveals underpayment >5%, audited party reimburses cost."`,
    riskLevel: 7,
  },

  // ============================================================
  // MISCELLANEOUS TRAPS
  // ============================================================
  {
    id: 'entire-agreement-bars-reliance',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Entire Agreement Barring Reliance',
    patterns: [
      /\b(?:entire\s+agreement|merger\s+clause|integration\s+clause)\b.{0,80}?\b(?:not\s+(?:rely(?:ing)?|relied|relied\s+upon)|no\s+(?:other|outside)\s+(?:representations?|warranties?|inducements?)|acknowledges?\s+(?:that\s+)?it\s+has\s+not\s+(?:relied|been\s+induced))\b/i,
    ],
    description: `States the written contract is the entire deal and you haven't relied on ANY promises not in the writing — killing fraud claims too.`,
    whyRisky: `Any verbal promises made during sales or negotiation are void. Even if a salesperson promised something, it's unenforceable.`,
    askLawyer: `Were there any verbal promises not captured in the writing? Can we add "not excluding liability for fraud"?`,
    suggestedFix: `Add: "This clause does not exclude liability for fraud or fraudulent misrepresentation."`,
    riskLevel: 7,
  },
  {
    id: 'unilateral-amendment',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Unilateral Amendment (Posting Changes)',
    patterns: [
      /\b(?:may|can|reserv(?:e|es|ed)\s+the\s+right\s+to)\s+(?:amend|modify|change|update|revise|alter)\s+(?:these|this)\s+(?:terms|agreement|policy)\s+(?:at\s+)?(?:any\s+time|from\s+time\s+to\s+time)\b.{0,60}?\b(?:post(?:ing)?\s+(?:updated|revised|changed)\b)/i,
      /\byour\s+(?:continued|ongoing)\s+(?:use\s+of|access\s+to)\s+(?:the\s+)?(?:service|product|platform|website)\s+(?:constitutes?|shall\s+constitute|will\s+be\s+deemed)\s+(?:acceptance|agreement)\b/i,
    ],
    description: `They can change any term just by posting a new version online. Your continued use = acceptance.`,
    whyRisky: `The contract you signed today can be completely rewritten tomorrow. You only find out by reading the fine print. Pricing, scope, obligations — all changeable without your say.`,
    askLawyer: `Can we require mutual written consent for material changes? Can you terminate without penalty if you reject a change?`,
    suggestedFix: `"Any material change requires 30 days written notice. Customer may terminate without penalty within 30 days of any material change."`,
    riskLevel: 8,
  },
  {
    id: 'non-disparagement-no-exception',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Non-Disparagement (No Truthful Exception)',
    patterns: [
      /\b(?:shall\s+not|will\s+not|agree(?:s)?\s+not\s+to)\s+(?:disparage|denigrate|defame|make\s+(?:any\s+)?negative\s+(?:statements?|comments?))\b(?!(?:.{0,300}?\b(?:truthful|honest|legal|required\s+by\s+law|regulatory|proceeding|proceeding)\b))/i,
    ],
    description: `Prohibits you from saying anything negative about them — with no exception for truthful statements.`,
    whyRisky: `Even honest feedback or reviews could violate this clause. Can silence whistleblowers.`,
    askLawyer: `Are truthful statements, regulatory complaints, or legal testimony exempted?`,
    suggestedFix: `"Nothing in this clause prevents truthful statements, legal testimony, regulatory complaints, or honest professional reviews."`,
    riskLevel: 7,
  },
  {
    id: 'cross-default',
    category: 'Miscellaneous',
    severity: 'critical',
    label: 'Cross-Default (One Breach Kills All)',
    patterns: [
      /\bcross-?default\b|\bcross\s+default\b/i,
      /\b(?:default|breach)\s+(?:of|under|pursuant\s+to)\s+(?:any\s+)?(?:other|separate|related)\s+(?:agreement|contract|order|SOW)\b/i,
    ],
    description: `If you breach ANY agreement with them, it breaches ALL agreements with them — allowing termination of everything.`,
    whyRisky: `A minor late payment on one service could terminate ALL your contracts, including unrelated ones.`,
    askLawyer: `Can cross-default be removed entirely? If not, can it be limited to material breaches above a dollar threshold?`,
    suggestedFix: `Remove entirely. If impossible: "Cross-default only applies if aggregate uncured default exceeds [$X]."`,
    riskLevel: 9,
  },
  {
    id: 'exclusive-remedy-no-carveout',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Exclusive Remedy (Refund Only)',
    patterns: [
      /\b(?:sole|exclusive|only)\s+(?:and\s+)?(?:exclusive\s+)?(?:remedy|recourse)\s+(?:is|shall\s+be)\s+(?:for\s+)?(?:the\s+)?(?:refund|re-?performance|replacement)\b(?!.{0,150}?\b(?:death|bodily\s+injury|fraud|IP\s+infring|confidentiality|data\s+breach)\b)/i,
    ],
    description: `Your ONLY remedy for any problem is a refund — no matter what damage they cause.`,
    whyRisky: `If their software failure costs you $50K, you get a $5K refund and eat the $45K. No remedy for IP theft, data breach, or gross negligence.`,
    askLawyer: `Are there carve-outs for IP infringement, confidentiality breach, data breach, fraud, bodily injury?`,
    suggestedFix: `"Exclusive remedy does not apply to claims for IP infringement, breach of confidentiality, data breach, fraud, or bodily injury."`,
    riskLevel: 8,
  },
  {
    id: 'early-termination-fee',
    category: 'Miscellaneous',
    severity: 'critical',
    label: 'Heavy Early Termination Penalty',
    patterns: [
      /\b(?:early\s+)?termination\b.{0,30}?(?:fee|penalty|charge|pay(?:ment)?).{0,40}?\b(?:remaining|unpaid|outstanding)\s+(?:balance|amount|fees?|payments?)\b/i,
      /\b(?:shall|will)\s+(?:be\s+)?(?:liable|obligated)\s+(?:for\s+)?(?:the\s+)?(?:full|entire|remaining)\s+(?:amount|value|balance|fees?)\s+(?:of\s+)?(?:the\s+)?(?:agreement|contract|term)\b/i,
      /\baccelerated?\s+(?:payment|balance|amount|fees?)\b.{0,40}?\b(?:termination|cancel)/i,
    ],
    description: `You owe the full remaining contract value if you cancel early — often far more than any real loss.`,
    whyRisky: `If you need to cancel due to poor service or budget cuts, you still owe everything. This acts as a barrier to switching to better alternatives.`,
    askLawyer: `Is the fee a genuine estimate of actual losses (liquidated damages)? Does it decrease over time?`,
    suggestedFix: `"Early termination fee decreases by [X]% per month through the term. No fee if terminating for material breach by provider."`,
    riskLevel: 9,
  },
  {
    id: 'acceptance-sole-discretion',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Acceptance at Their Sole Discretion',
    patterns: [
      /\b(?:sole|absolute)\s+(?:discretion|judgment|satisfaction)\s+(?:to\s+)?(?:reject|accept|approve|refuse)\s+(?:any|the)\s+(?:work|deliverable|product|output|application)\b/i,
      /\bacceptance\s+(?:criteria|standard|procedure|process)\s+(?:shall\s+)?(?:be\s+)?(?:determined|established|set)\s+(?:by|solely\s+by)\s+(?:the\s+)?(?:client|customer|company)\b/i,
    ],
    description: `They can reject your work based on their "sole satisfaction" with no objective criteria — no limit on revisions.`,
    whyRisky: `You can deliver perfect work and have it rejected. You may have to redo work indefinitely at your own cost — classic scope creep tactic.`,
    askLawyer: `Can acceptance criteria be defined upfront? Is there a "deemed acceptance" after a period? A limit on revision rounds?`,
    suggestedFix: `Define objective acceptance criteria. Add: "Deliverables not rejected within 10 business days are deemed accepted. Revisions beyond 2 rounds are billed additionally."`,
    riskLevel: 8,
  },
  {
    id: 'subcontract-without-consent',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Subcontracting Without Your Consent',
    patterns: [
      /\b(?:may|can|reserv(?:e|es|ed)\s+the\s+right\s+to)\s+(?:subcontract|delegate|outsource)\s+(?:any|all|part\s+of)\s.{0,50}?\bwithout\s+(?:your|prior|our|the\s+client's)\s+(?:written\s+)?(?:prior\s+)?(?:consent|approval|authorization)\b/i,
    ],
    description: `They can subcontract your work to anyone without asking you.`,
    whyRisky: `You hired a specific company for their expertise — subcontracting means someone else may do the actual work. No recourse if the subcontractor is incompetent.`,
    askLawyer: `Can you approve/reject subcontractors? Do they remain fully responsible for subcontracted work?`,
    suggestedFix: `"Provider shall not subcontract without Client's prior written consent. Provider remains fully liable for all subcontracted work."`,
    riskLevel: 6,
  },
  {
    id: 'unlimited-revisions',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Unlimited Complimentary Revisions',
    patterns: [
      /\b(?:unlimited|complimentary|free|no\s+additional\s+(?:charge|cost|fee))\s.{0,30}?(?:revisions?|iteration|round|changes?)\b/i,
    ],
    description: `Revisions are included at no additional cost with no limit. Sounds good but is a trap.`,
    whyRisky: `"Unlimited revisions" means the client can keep requesting changes forever. All your profit disappears into unbillable revision cycles.`,
    askLawyer: `Is there a cap on revision rounds or hours?`,
    suggestedFix: `"Includes 2 rounds of revisions. Additional revisions billed at [hourly rate]. Deemed acceptance after 10 business days."`,
    riskLevel: 6,
  },
  {
    id: 'liquidation-damages-harsh',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Harsh Liquidated Damages',
    patterns: [
      /\bliquidated\s+damages?\b.{0,60}?\$(?:\d{1,3}(?:,\d{3})*|\d+)\s+(?:per|for\s+each|for\s+every)\s+(?:day|week|month)\b/i,
    ],
    description: `You must pay a fixed amount for each day/week of delay — can quickly exceed the contract value.`,
    whyRisky: `$500/day penalty on a $20K contract becomes punitive after 40 days. Courts require these to be reasonable estimates of actual harm, but many are structured punitively.`,
    askLawyer: `Is the amount a genuine pre-estimate of loss? Is there a cap?`,
    suggestedFix: `"Liquidated damages capped at total contract value. They are the sole remedy for delay and not cumulative with other damages."`,
    riskLevel: 7,
  },
  {
    id: 'minimum-commitment',
    category: 'Miscellaneous',
    severity: 'high',
    label: 'Minimum Spend or Commitment',
    patterns: [
      /\bminimum\s.{0,20}?(?:commitment|spend|volume|purchase|guarantee|revenue|fee|charge)\s+(?:of\s+)?\$?[\d,]+[kK]?\s+(?:per\s+)?(?:month|quarter|year|annually)/i,
      /\btake-or-pay\b/i,
    ],
    description: `You must spend a minimum amount per period regardless of whether you need the service.`,
    whyRisky: `If your needs change or business slows, you still owe the minimum. Unused credits often don't carry forward.`,
    askLawyer: `Can unused amounts carry forward? Is it prorated on early termination?`,
    suggestedFix: `"Unused minimum commitment carries forward to the next period. Prorated on early termination."`,
    riskLevel: 7,
  },
  {
    id: 'most-favored-pricing',
    category: 'Miscellaneous',
    severity: 'medium',
    label: 'Most Favored / Best Pricing Clause',
    patterns: [
      /\bmost\s+favored\s+(?:nation|customer|pricing|status|pricing\s+terms)\b/i,
      /\b(?:if|should)\s+(?:you|the\s+(?:provider|contractor|developer|vendor))\s+(?:offer|provide|grant)\s+(?:a\s+)?(?:lower|better|more\s+favorable)\s+(?:price|rate|pricing|terms)\b.{0,80}?\b(?:match|equal|extend|offer\s+the\s+same)\b/i,
    ],
    description: `If you offer a better price to anyone else, you must extend it to them too.`,
    whyRisky: `Limits your pricing flexibility. Can't offer promotional or volume discounts without triggering this clause.`,
    askLawyer: `Are there exceptions for volume discounts, non-profit rates, promos?`,
    suggestedFix: `"Applies only to substantially similar scope/volume. Excludes promotional pricing capped at [X] months and non-profit discounts."`,
    riskLevel: 5,
  },
];
