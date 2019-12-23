class Particle {
    constructor(x, y, z, mass) {
        this.position = clothFunction(x, y); // position
        this.previous = clothFunction(x, y); // previous
        this.original = clothFunction(x, y); 
        this.a = new THREE.Vector3(0, 0, 0); // acceleration
        this.mass = mass;
        this.invMass = 1 / mass;
        this.tmp = new THREE.Vector3();
        this.tmp2 = new THREE.Vector3();

        this.addForce = (force) => {
            this.a.addSelf(
                this.tmp2.copy(force).multiplyScalar(this.invMass)
            );
        }

        this.integrate = (timesq) => {
            var newPos = this.tmp.sub(this.position, this.previous);
            newPos.multiplyScalar(DRAG).addSelf(this.position);
            newPos.addSelf(this.a.multiplyScalar(timesq));
            
            this.tmp = this.previous;
            this.previous = this.position;
            this.position = newPos;
        
            this.a.set(0, 0, 0);
        }
    }
}