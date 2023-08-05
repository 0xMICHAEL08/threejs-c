declare module "stats.js" {
  export default class Stats {
    REVISION: number;
    dom: HTMLDivElement;
    domElement: HTMLDivElement;
    addPanel(pane: any): any;
    showPanel(id: number): void;
    begin(): void;
    end(): void;
    update(): void;
    fpsPanel: any;
    msPanel: any;
    memPanel: any;
  }
}
