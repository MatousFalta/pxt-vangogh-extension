

input.onButtonPressed(Button.A, () => {
    vanGogh.calib();
})

input.onButtonPressed(Button.B, () => {
    vanGogh.penUp();
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll()
    basic.clearScreen()
})

