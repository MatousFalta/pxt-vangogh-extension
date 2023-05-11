const penUp = 1260;
const penDown = 1360;
const pen = PCAmotor.Servos.S1;
const left = PCAmotor.Steppers.STPM1;
const right = PCAmotor.Steppers.STPM2;

PCAmotor.GeekServo(pen, penUp)

input.onButtonPressed(Button.A, () => {
    for (let i = 0; i < 44; i++) {
        leafPart();
    }
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll()
    basic.clearScreen()
})

function leafPart() {
    PCAmotor.GeekServo(pen, penDown)
    PCAmotor.StepperStart(left)
    PCAmotor.StepperStart(right)
    basic.pause(1600)
    PCAmotor.MotorStopAll()
    PCAmotor.GeekServo(pen, penUp)
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
