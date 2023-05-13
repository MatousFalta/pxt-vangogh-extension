namespace vanGogh {
    // inicializace serv
    const pen = PCAmotor.Servos.S1;
    const left = PCAmotor.Steppers.STPM1;
    const right = PCAmotor.Steppers.STPM2;
    //prumer kola v mm
    const _d = 65;
    // Otacka kola const _rev ;

    // Kalibrace
    export function calib()
    {

    }

    // Forward/Backward
    export function fd(dist: number, invert: boolean = true): void {
        PCAmotor.StepperStart(left, invert)
        PCAmotor.StepperStart(right, invert)
        basic.pause(calDist(dist))
        PCAmotor.MotorStopAll();
    }

    // Rotate
    export function re(degree: number, invert: boolean = true): void {
        PCAmotor.StepperStart(left, !invert)
        PCAmotor.StepperStart(right, invert)
    }

    // Vypocet vzdalenosti na cas
    function calDist(t: number): number {
        let dist;
        return dist;
    }

    // Zvednuti tuzky
    export function penUp(): void {
        PCAmotor.GeekServo(pen, 1260)
        basic.showArrow(ArrowNames.North)
    }

    // Spusteni tuzky
    export function penDown(): void {
        PCAmotor.GeekServo(pen, 1940)
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