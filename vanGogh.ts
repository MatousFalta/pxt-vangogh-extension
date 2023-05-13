class vanGogh {
    //prumer kola
    private _d: number;
    // Otacka kola
    private _rev: number;

    // Kalibrace
    public calib(): number {
        let d;
        let rev;

        return d, rev;
    }

    // Forward
    public fd(dist: number, invert: boolean): void {
        PCAmotor.StepperStart(left)
        PCAmotor.StepperStart(right)
        basic.pause(this.calDist(dist))

    }

    // Vypocet vzdalenosti na cas
    public calDist(t: number): number {
        let dist;
        return dist;
    }
}