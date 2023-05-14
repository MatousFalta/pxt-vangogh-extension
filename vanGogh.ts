namespace vanGogh {
    // inicializace serv
    const pen = PCAmotor.Servos.S1;
    const left = PCAmotor.Steppers.STPM1;
    const right = PCAmotor.Steppers.STPM2;
    // Jak moc se sníží pero nebo zvedne
    const minPenHeight = 1935;
    const maxPenHeight = 1260;
    //prumer kola v mm
    const _d = 65;

    // Otacka kola const _rev ;
    // Kalibrace
    export function calib()
    {
        penUp();
        basic.pause(1000);
        fd(1000);
        penDown();
        basic.pause(1000);
        fd(4000);
        penUp();
    }

    // Forward/Backward
    export function fd(dist: number, invert: boolean = true): void {
        PCAmotor.StepperStart(left, invert)
        PCAmotor.StepperStart(right, invert)
        basic.pause(calcDist(dist))
        PCAmotor.MotorStopAll();
    }

    // Rotate
    export function re(degree: number, invert: boolean = true): void {
        PCAmotor.StepperStart(left, !invert)
        PCAmotor.StepperStart(right, invert)
    }

    // Vypocet vzdalenosti na cas
    function calcDist(t: number): number {
        let dist;
        return t;
    }

    // Zvednuti tuzky
    export function penUp(): void {
        PCAmotor.GeekServo(pen, maxPenHeight)
        basic.showArrow(ArrowNames.North)
    }

    // Spusteni tuzky
    export function penDown(): void {
        PCAmotor.GeekServo(pen, minPenHeight)
        basic.showArrow(ArrowNames.South)
    }

    export function leafPart(): void {
        penDown();
        PCAmotor.StepperStart(left)
        PCAmotor.StepperStart(right)
        basic.pause(1600)
        PCAmotor.MotorStopAll()
        penUp();
        PCAmotor.StepperStart(left, false)
        PCAmotor.StepperStart(right)
        basic.pause(500)
        PCAmotor.MotorStopAll()
        PCAmotor.StepperStart(left, false)
        PCAmotor.StepperStart(right, false)
        basic.pause(1600)
        PCAmotor.MotorStopAll()
        basic.pause(200)
    }
}