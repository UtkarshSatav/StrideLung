import { Chip } from "@/trolley/Chip";

const ROWS = [
  ["Getinge lists one Cardiohelp console at 255 W × 315 H × 427 D mm and approximately 12 kg", "S1", "Existing portable equipment has a substantial envelope", "That the proposed smaller drive and electronics fit or perform equivalently"],
  ["HLS documentation shows integrated oxygenator, heat exchanger and centrifugal pump functions", "S2", "Functional integration already exists", "That this concept's cartridge geometry is validated"],
  ["LivaNova EOS lists PMP membrane material and a stainless-steel heat exchanger", "S3", "These are real material examples", "A universal housing resin, steel grade, or a selected supplier"],
  ["BOC lists a CD cylinder with 460 L nominal contents, 2 L water capacity and 3.5 kg nominal weight", "S4", "Gas storage is a meaningful mass and space dependency", "The duration or exact external dimensions of the CAD cylinder"],
  ["ECMO mobilisation is addressed in ELSO guidance and existing clinical practice", "S5, S6", "The clinical workflow already exists", "That this case makes a patient eligible to mobilise"],
];

export function Evidence() {
  return (
    <div className="table-wrap">
      <table className="table evidence">
        <thead>
          <tr><th scope="col">Verified reference fact</th><th scope="col">What it supports</th><th scope="col">What it does not establish</th></tr>
        </thead>
        <tbody>
          {ROWS.map(([fact, src, supports, not]) => (
            <tr key={src}>
              <td><Chip status="R" /> {fact} <span className="src">[{src}]</span></td>
              <td>{supports}</td>
              <td className="muted">{not}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note">There is no measured incumbent trolley in this project: no percentage size, weight, cost or staffing reduction is claimed.</p>
    </div>
  );
}
