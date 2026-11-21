import { TrolleyProvider } from "@/trolley/TrolleyProvider";
import { Explorer } from "@/trolley/Explorer";
import { Hero } from "@/site/Hero";
import { Section } from "@/site/Section";
import { Subsystems } from "@/site/Subsystems";
import { Plan } from "@/site/Plan";
import { MassBudget } from "@/site/MassBudget";
import { Resources } from "@/site/Resources";
import { Evidence } from "@/site/Evidence";
import { RegisterTable } from "@/site/RegisterTable";
import { Limits } from "@/site/Limits";
import { Sources } from "@/site/Sources";
import { ParallelTeaser } from "@/site/ParallelTeaser";

export default function Home() {
  return (
    <TrolleyProvider>
      <Hero />
      <Section
        id="explore"
        eyebrow="01 · Interactive model"
        title="Open it. Take it apart. Trace every flow."
        lead="Hover any part for its register entry, or pick one from the list. Open the case, explode the modules forward out of their bays, park it on its stabilisers, raise the handle, and run the blood, gas, water and electrical overlays — each a convention, not a measurement."
        className="explore"
      >
        <Explorer />
      </Section>
      <Section id="subsystems" eyebrow="02 · Subsystems" title="Five layers, one case." lead="Each layer can be isolated in the model with its flow running. Pick a component to jump straight to it.">
        <Subsystems />
      </Section>
      <Section id="plan" eyebrow="03 · Packaging plan" title="How it gets compact — and what has to be proven first." lead="Eight packaging decisions from the brief, each paired with the evidence required before any hardware claim.">
        <Plan />
      </Section>
      <Section id="budget" eyebrow="04 · Mass budget" title="26.78 kg, counted once." lead="Every row is an allocation. The integral valve, the battery case and BMS, and the illustrative fluid are already inside their rows; nothing is added twice. The patient, ventilator, monitor and unlisted consumables are excluded.">
        <MassBudget />
      </Section>
      <Section id="resources" eyebrow="05 · Resources" title="Illustrative arithmetic, not a runtime." lead="Two worked sums from the brief. Their only job is to show what the numbers depend on.">
        <Resources />
      </Section>
      <Section id="evidence" eyebrow="06 · Evidence" title="What the references support — and what they don’t." lead="Existing products are reality checks, not interchangeable parts of a qualified new assembly.">
        <Evidence />
      </Section>
      <Section id="register" eyebrow="07 · Component register" title="All 27 components." lead="Sort, filter or search the register. Each row opens its own page, or shows the component in the model.">
        <RegisterTable />
      </Section>
      <Section id="parallel" eyebrow="08 · Concept exploration" title="What if there were two oxygenators?" lead="A separate, concept-only figure explores packaging two cartridges on parallel branches — and every question that raises.">
        <ParallelTeaser />
      </Section>
      <Section id="limits" eyebrow="09 · Limits" title="Concept packaging — not a clinical device.">
        <Limits />
      </Section>
      <Section id="sources" eyebrow="10 · Sources" title="Sources">
        <Sources />
      </Section>
    </TrolleyProvider>
  );
}
