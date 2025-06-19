//% color="#CC7722" icon="\uf1fc" block="Van Gogh" blockId="vanGogh"
namespace vanGogh {
    // initialization of servos
    const _pen = PCAmotor.Servos.S1;
    const _left = PCAmotor.Steppers.STPM1;
    const _right = PCAmotor.Steppers.STPM2;
    // How much does the pen lower or raise
    const _minPenHeight = 1260;
    const _maxPenHeight = 1900;
    //shift speed in mm/ms
    let _spd = 0.0215;
    //rotation speed deg/ms
    let _degSpd = 0.0178;
    let on: boolean = false;
    let measuringDistance: boolean = false;
    let measuringDeg: boolean = false;
    let measuringCSideLength: boolean = false;

    enum degMenu {
        begin,
        makeCircle,
        stopMakeCircle,
        calibrateDeg
    }
    enum distanceMenu {
        start,
        departure,
        stop,
        measuring10cm
    }

    let currentDegCalibration: degMenu = degMenu.begin;
    let current: distanceMenu = distanceMenu.start;
    let startTime: number;
    let endTime: number;
    let time10cm: number;
    let deaviation: number = 0;
    let circleTime: number = 0;
    let cSideLength: number = 0;

    function testAnalogInput() {
        let value = pins.analogReadPin(AnalogPin.P2)
        console.log(value)
        basic.pause(500)
    }

    basic.forever(function () {
        testAnalogInput()
    })
/*    basic.forever(function () {
        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
            console.log(i);  // černá detekována
            i++;
        } else {
            console.log(i);  // světlé pozadí
            i--;
        }
        basic.pause(50);
    })*/
    basic.showString("press B");
    input.onButtonPressed(Button.AB, () => {
        if (!measuringDistance && !measuringCSideLength) {
            basic.clearScreen();
            escapingPredator();
        }
        else if (measuringDistance) {
            calculateRealDistance(deaviation);
        }
        else if (measuringCSideLength){
            calculateRealCircleLength(cSideLength);
        }
    })

    input.onButtonPressed(Button.A, () => {
        if (!measuringDistance && !measuringDeg) {
            current--;
            speedCalibration();
        }

        if (measuringDistance) {
            deaviation--;
            deaviationLimiter(deaviation);
        }
        if (measuringDeg && !measuringCSideLength) {
            currentDegCalibration--;
            degSpeedCalibration();
        }
        if (measuringCSideLength) {
            cSideLength--;
            cSideLengthLimiter(cSideLength);
        }
    });

    input.onButtonPressed(Button.B, () => {
        if (!measuringDistance && !measuringDeg) {
            current++;
            speedCalibration();
        }
        if (measuringDistance) {
            deaviation++
            deaviationLimiter(deaviation);
        }
        if (measuringDeg && !measuringCSideLength) {
            currentDegCalibration++;
            degSpeedCalibration();
        }
        if (measuringCSideLength) {
            cSideLength++;
            cSideLengthLimiter(cSideLength);
        }
    });
    function speedCalibration() {
        switch (current) {
            case distanceMenu.start:
                PCAmotor.MotorStopAll();
                basic.showString("A", 0);
                break;
            case distanceMenu.departure:
                startTime = control.millis();
                moveForward();
                basic.showString("B", 0);
                break;
            case distanceMenu.stop:
                PCAmotor.MotorStopAll();
                endTime = control.millis();
                endTime = endTime - startTime;
                time10cm = endTime / 2;
                basic.showString("C", 0);
                break;
            case distanceMenu.measuring10cm:
                basic.showString("D", 0);
                moveForward();
                basic.pause(time10cm);
                PCAmotor.MotorStopAll();
                measuringDistance = true;
                deaviationLimiter(deaviation);
                break;
        }
    }
//asd
    function degSpeedCalibration() {
        switch (currentDegCalibration) {
            case degMenu.begin:
                PCAmotor.MotorStopAll();
                basic.showString("1", 0);
                break;
            case degMenu.makeCircle:
                basic.showString("2", 0);
                penDown();
                moveForward();
                basic.pause(time10cm);
                PCAmotor.MotorStopAll();
                penUp();
                moveBackward();
                basic.pause(time10cm);
                PCAmotor.MotorStopAll();
                basic.pause(100);
                startTime = control.millis();
                turnRight();
                break;
            case degMenu.stopMakeCircle:
                basic.showString("3", 0);
                endTime = control.millis();
                PCAmotor.MotorStopAll();
                penDown();
                moveForward();
                basic.pause(time10cm);
                PCAmotor.MotorStopAll();
                penUp();
                moveBackward();
                basic.pause(time10cm);
                PCAmotor.MotorStopAll();
                measuringCSideLength = true;
                whaleysans.showNumber(cSideLength);
                break;
        }
    }

    // Always start calibration with Distance Calibration then Rotation Calibration

    //% blockId=calibDist block="Calibrate distance"
    //% weight=79
    //% blockGap=50
    export function calibDist() {
        penUp();
        basic.pause(500);
        PCAmotor.StepperStart(_left);
        PCAmotor.StepperStart(_right);
        basic.pause(500);
        PCAmotor.MotorStopAll();
        penDown();
        basic.pause(500);
        PCAmotor.StepperStart(_left);
        PCAmotor.StepperStart(_right);
        basic.pause(5000);
        PCAmotor.MotorStopAll();
        penUp();
    }

    //% blockId=calibRot block="Calibrate rotation"
    //% weight=79
    //% blockGap=50
    export function calibRot() {
        penDown();
        fd(50);
        penUp();
        fd(50, false);
        penDown();
        PCAmotor.StepperStart(_left, false);
        PCAmotor.StepperStart(_right);
        basic.pause(5000);
        PCAmotor.MotorStopAll();
        fd(50);
        penUp();
        fd(50, false);
    }

    /**
     * Van Gogh move
     * @param dist is distance of run in mm; eg: 10
     * @param invert is direction forward or backward; eg: true
    */
    //% blockId=fd block="Van Gogh move |%dist| mm forward |%invert|"
    //% weight=92
    export function fd(dist: number, invert: boolean = true): void {
        PCAmotor.StepperStart(_left, invert);
        PCAmotor.StepperStart(_right, invert);
        basic.pause(calcDist(dist));
        PCAmotor.MotorStopAll();
    }

    /**
     * Van Gogh move with certain speed
     * @param dist is distance of run in mm; eg: 10
     * @param interval is indicates the frequency of stopping in ms; eg: 10
     * @param invert is direction forward or backward; eg: true
    */
    //% blockId=fdSpeed block="Van Gogh move |%dist| mm forward |%invert| with stopping |%interval|"
    //% weight=92
    export function fdSpeed(dist: number, invert: boolean = true, interval: number = 1000): void {
        for (let i = 0; i <= interval; i++) {
            fd(dist / interval, invert);
            PCAmotor.MotorStopAll();
            basic.pause(1);
        }
    }

    /**
     * Van Gogh rotate
     * @param deg is rotation in degrees; eg: 10
     * @param invert is direction of rotation; eg: true
    */
    //% blockId=re block="Van Gogh rotate |%deg|° clockwise |%invert|"
    //% weight=92
    export function re(deg: number, invert: boolean = true): void {
        PCAmotor.StepperStart(_left, invert);
        PCAmotor.StepperStart(_right, !invert);
        basic.pause(calcDeg(deg));
        PCAmotor.MotorStopAll();
    }

    // Calculate distance to time with calibrated run speed
    function calcDist(t: number): number {
        return t / _spd;
    }
    // VCalculate rotation to time with calibrated rotation speed
    function calcDeg(d: number): number {
        return d / _degSpd;
    }

    function deaviationLimiter(b: number): void {
        if (b < -100) {
            b = -100;
        }
        else if (b > 100) {
            b = 100;
        }
        deaviation = b;
        if (deaviation < 0) {
            basic.showNumber(deaviation);
        }
        else {
            whaleysans.showNumber(deaviation);
        }
    }

    function cSideLengthLimiter(b: number): void {
        if (b < -100) {
            b = -100;
        }
        else if (b > 100) {
            b = 100;
        }
        cSideLength = b;
        if (cSideLength < 0) {
            basic.showNumber(cSideLength);
        }
        else {
            whaleysans.showNumber(cSideLength);
        }
    }

    function calculateRealDistance(i: number): void {
        let ratio: number;
        let totalDistance: number;

        measuringDistance = false;
        totalDistance = 100 + i;
        ratio = totalDistance / 100;
        time10cm = time10cm / ratio;
        _spd = 100 / time10cm;
        console.log(_spd);
        basic.clearScreen();
        measuringDeg = true;
    }

    function calculateRealCircleLength(c: number){
        let ratio: number;
        let realDeg: number;
        let rad: number;
        let deg: number;

        circleTime = endTime - startTime;
        rad = 2 * Math.asin(c/20)
        deg = rad * 180 / Math.PI;
        realDeg = 360 + deg;
        ratio = realDeg / 360;
        circleTime = circleTime / ratio;
        _degSpd = 360 / circleTime;
        console.log(_degSpd);
        basic.showNumber(_degSpd);
    }

    export function escapingPredator(): void {
        if (!on) {
            moveForward();
            on = true;
        }
        else {
            PCAmotor.MotorStopAll();
            on = false;
        }
    }

    export function moveForward(): void {
        PCAmotor.StepperStart(_left, false);
        PCAmotor.StepperStart(_right, false);
    }

    export function moveBackward(): void {
        PCAmotor.StepperStart(_left, true);
        PCAmotor.StepperStart(_right, true);
    }

    export function turnLeft(): void {
        PCAmotor.StepperStart(_left, true);
        PCAmotor.StepperStart(_right, false);
    }

    export function turnRight(): void {
        PCAmotor.StepperStart(_left, false);
        PCAmotor.StepperStart(_right, true);
    }
    //% blockId=penUp block="Raise pen"
    //% weight=79
    //% blockGap=50
    export function penUp(): void {
        PCAmotor.GeekServo(_pen, _maxPenHeight);
        basic.showArrow(ArrowNames.North);
    }

    //% blockId=penDown block="Launch pen"
    //% weight=79
    //% blockGap=50
    export function penDown(): void {
        PCAmotor.GeekServo(_pen, _minPenHeight);
        basic.showArrow(ArrowNames.South);
    }

    /**
     * Van Gogh draw rectangle
     * @param a is length of side A; eg: 10
     * @param b is length of side B; eg: 10
    */
    //% blockId=rectangle block="Van Gogh draw rectangle of size |%a| mm side A and of size |%b| mm side B"
    //% weight=92
    export function rectangle(a: number, b: number): void {
        penDown();
        for (let i = 0; i < 4; i++) {
            re(90);
            fd(i % 2 == 0 ? a : b);
        }
        penUp();
    }

    /**
     * Van Gogh draw circle
     * @param d is diameter of circle; eg: 10
    */
    //% blockId=circle block="Van Gogh draw circle with diameter of |%d| mm"
    //% weight=92
    export function circle(d: number): void {
        const circumference = Math.PI * d;
        penUp();
        fd(d / 2);
        re(90);
        for (let i = 0; i < 60; i++) {
            penDown();
            fd(circumference / 60);
            re(6);
        }
        penUp();
    }

    /**
     * Van Gogh draw Koch Snowflake
     * @param n is number of iterations; eg: 3
     * @param d is length of line segment in mm; eg: 10
    */
    //% blockId=KochFlake block="Van Gogh draw Koch Snowflake by |%n| iterations with a line segment length of |%d| mm"
    //% weight=92
    export function KochFlake(n: number, d: number): void {
        if (n == 0) {
            penDown();
            vanGogh.fd(d);
        }
        else {
            KochFlake(n - 1, d);
            re(60, false);
            KochFlake(n - 1, d);
            re(120);
            KochFlake(n - 1, d);
            re(60, false);
            KochFlake(n - 1, d);
        }
    }
}
