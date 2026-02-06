// Risk Assessment Questions Data
const ASSESSMENT_CATEGORIES = [
    {
        id: 'customer_experience',
        title: 'Customer Experience Impact',
        description: 'This section measures how fulfillment issues affect your customers and brand reputation.',
        headerImage: '/images/customer-experience.png',
        footerNote: 'Again. No judgment here. The purpose of these questions is to help you diagnose if there is in fact a bigger issue that you can address. In the next section we will address Inventory and Demand control.',
        questions: [
            {
                id: 'customer_experience_q1',
                text: 'Fulfillment issues regularly lead to refunds, chargebacks, or churn.'
            },
            {
                id: 'customer_experience_q2',
                text: 'Retail fulfillment issues result in penalties or strained buyer relationships.'
            },
            {
                id: 'customer_experience_q3',
                text: 'Customer support is reactive with no root-cause tracking.'
            },
            {
                id: 'customer_experience_q4',
                text: 'Complaints about packaging, timelines, or damage are frequent.'
            },
            {
                id: 'customer_experience_q5',
                text: 'Fulfillment issues are eroding brand trust or promise.'
            }
        ]
    },
    {
        id: 'inventory',
        title: 'Inventory & Demand Control',
        description: 'These risks often show up as stockouts, excess inventory, missed retail POs, or reactive purchasing.',
        headerImage: '/images/inventory-demand.png',
        footerNote: 'If you checked two or more items in this section, inventory and demand planning issues may be contributing to cash flow or service-level constraints. Continue through the assessment to see how these risks connect.',
        questions: [
            {
                id: 'inventory_q1',
                text: 'Inventory visibility is fragmented or manual.'
            },
            {
                id: 'inventory_q2',
                text: 'Demand forecasting is assumption-based beyond a few weeks.'
            },
            {
                id: 'inventory_q3',
                text: 'Allocating inventory across channels forces tradeoffs.'
            },
            {
                id: 'inventory_q4',
                text: 'SKU-level turnover is unclear.'
            },
            {
                id: 'inventory_q5',
                text: 'Dead/slow inventory is detected late, tying up cash.'
            }
        ]
    },
    {
        id: 'accuracy',
        title: 'Order Accuracy & Exceptions',
        description: 'These risks typically surface as reships, chargebacks, strained retail relationships, and rising support costs.',
        headerImage: '/images/order-accuracy.png',
        footerNote: 'If you checked two or more items in this section, order execution issues may be introducing hidden cost or operational friction. Continue through the assessment to understand how this connects to other areas.',
        questions: [
            {
                id: 'accuracy_q1',
                text: 'Frequent order errors requiring reships or credits.'
            },
            {
                id: 'accuracy_q2',
                text: 'Retail POs are sometimes non-compliant or late.'
            },
            {
                id: 'accuracy_q3',
                text: 'Exceptions are discovered reactively.'
            },
            {
                id: 'accuracy_q4',
                text: 'Order resolution requires heavy manual effort.'
            },
            {
                id: 'accuracy_q5',
                text: 'Costs of reships/credits are not tracked separately.'
            }
        ]
    },
    {
        id: 'shipping',
        title: 'Shipping Cost & Carrier Risk',
        description: 'These risks usually show up as margin erosion, volatility in shipping spend, or limited flexibility during peak periods.',
        headerImage: '/images/shipping-carrier.png',
        footerNote: 'If two or more items apply here, shipping costs or carrier performance may be constraining margins as volume increases. The remaining sections help clarify whether this risk stands alone or compounds elsewhere.',
        questions: [
            {
                id: 'shipping_q1',
                text: 'Cost-per-order shipped is unclear or volatile.'
            },
            {
                id: 'shipping_q2',
                text: 'Carrier invoices aren\'t audited.'
            },
            {
                id: 'shipping_q3',
                text: 'Retail chargebacks inflate shipping costs.'
            },
            {
                id: 'shipping_q4',
                text: 'Carrier performance is not reviewed.'
            },
            {
                id: 'shipping_q5',
                text: 'Limited carrier leverage creates inflexibility.'
            }
        ]
    },
    {
        id: 'systems',
        title: 'Systems, Data & Visibility',
        description: 'These risks often manifest as blind spots, delayed decisions, and an over-reliance on tribal knowledge.',
        headerImage: '/images/systems-visibility.png',
        footerNote: 'If several items apply here, limited visibility may be weakening operational oversight as the business grows. The next section will help determine whether this is a tooling issue or a broader execution gap.',
        questions: [
            {
                id: 'systems_q1',
                text: 'Fulfillment systems require spreadsheets or manual fixes.'
            },
            {
                id: 'systems_q2',
                text: 'Labeling/EDI compliance is handled manually.'
            },
            {
                id: 'systems_q3',
                text: 'KPIs are scattered or not in a single dashboard.'
            },
            {
                id: 'systems_q4',
                text: 'Operational issues are identified too late.'
            },
            {
                id: 'systems_q5',
                text: 'Org relies on tribal knowledge, not systems.'
            }
        ]
    },
    {
        id: 'relationship',
        title: '3PL Relationship & Operational Control',
        description: 'These risks tend to surface as loss of control, misalignment, and difficulty holding partners accountable.',
        headerImage: '/images/3pl-relationship.png',
        footerNote: 'If two or more items apply here, gaps in partner alignment or control may be affecting execution. Viewed alongside the earlier sections, this can help complete the overall risk picture.',
        questions: [
            {
                id: 'relationship_q1',
                text: 'SLAs are poorly defined or enforced.'
            },
            {
                id: 'relationship_q2',
                text: '3PL lacks retail compliance expertise.'
            },
            {
                id: 'relationship_q3',
                text: 'Performance issues lack data or accountability.'
            },
            {
                id: 'relationship_q4',
                text: 'Fees and invoices are hard to verify.'
            },
            {
                id: 'relationship_q5',
                text: '3PL is misaligned with growth goals.'
            }
        ]
    }
];

const SCORE_OPTIONS = [
    { value: 0, label: 'Not an issue / N/A' },
    { value: 1, label: 'Minor issue' },
    { value: 2, label: 'Moderate issue' },
    { value: 3, label: 'Severe issue' }
];

// Export for use in wizard.js
window.ASSESSMENT_CATEGORIES = ASSESSMENT_CATEGORIES;
window.SCORE_OPTIONS = SCORE_OPTIONS;
