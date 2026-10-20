'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    audience: 'Up to 50 people',
    monthly: 4500,
    annual: 3800,
    blurb: 'For a single school branch or a small office that needs clean daily attendance.',
    features: [
      'One biometric device included in setup',
      'Live clock-in feed and daily KPIs',
      '30 day attendance history',
      'CSV payroll export',
      'Email support in English and Swahili',
    ],
  },
  {
    name: 'Growth',
    audience: 'Up to 200 people',
    monthly: 9500,
    annual: 7900,
    featured: true,
    blurb: 'For multi department organisations that report to a board every month.',
    features: [
      'Up to five devices and three locations',
      'Everything in Starter',
      'Absenteeism and late arrival alerts',
      'Leave management with approvals',
      'PDF and CSV reports, payroll ready',
      'Priority WhatsApp support',
    ],
  },
  {
    name: 'Enterprise',
    audience: 'Unlimited people',
    monthly: null,
    annual: null,
    blurb: 'For groups, hospitals and NGOs running several sites with custom reporting.',
    features: [
      'Unlimited devices and locations',
      'Role based access for every site',
      'Custom report builder and API access',
      'Data processing agreement and DPO support',
      'Onboarding and staff training in Nairobi',
    ],
  },
];

export default function PricingSection() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div>
      <div className="row between wrap gap-16" style={{ marginBottom: 28 }}>
        <div>
          <p className="eyebrow">Pricing</p>
          <h2 className="display-2" style={{ marginTop: 8 }}>Pay for the people you enrol.</h2>
          <p className="lede" style={{ marginTop: 8, maxWidth: 520 }}>
            All prices are in Kenyan shillings, exclusive of VAT. Switch or cancel at the end of any
            billing cycle.
          </p>
        </div>
        <div className="billing-toggle" role="group" aria-label="Billing cycle">
          <button type="button" data-active={cycle === 'monthly'} onClick={() => setCycle('monthly')}>
            Monthly
          </button>
          <button type="button" data-active={cycle === 'annual'} onClick={() => setCycle('annual')}>
            Annual, save 15%
          </button>
        </div>
      </div>

      <div className="grid grid-3">
        {plans.map((plan) => {
          const price = cycle === 'annual' ? plan.annual : plan.monthly;
          return (
            <article key={plan.name} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
              <div className="row between">
                <div>
                  <h3 className="heading-4">{plan.name}</h3>
                  <p className="tiny">{plan.audience}</p>
                </div>
                {plan.featured ? <span className="badge badge-info">Most chosen</span> : null}
              </div>

              {price ? (
                <div>
                  <p className="plan-price">
                    KES {price.toLocaleString('en-KE')}
                    <span> / month</span>
                  </p>
                  <p className="tiny">
                    {cycle === 'annual' ? 'Billed annually, two months saved' : 'Billed monthly, cancel anytime'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="plan-price" style={{ fontSize: '1.7rem' }}>Custom quote</p>
                  <p className="tiny">Priced per site and headcount</p>
                </div>
              )}

              <p className="muted" style={{ fontSize: '0.86rem' }}>{plan.blurb}</p>

              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} style={{ color: 'var(--color-success)', flex: 'none', marginTop: 2 }} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.monthly ? '/auth/signup' : '/demo#request-demo'}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} btn-block`}
                style={{ marginTop: 'auto' }}
              >
                {plan.monthly ? 'Start a free trial' : 'Talk to our team'}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
