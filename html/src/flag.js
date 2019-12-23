var DAMPING = 0.03,
    DRAG = 1 - DAMPING,
    MASS = .1,
    restDistance = 20,
    xSegs = 15,
    ySegs = 10,
    clothFunction = plane(restDistance * xSegs, restDistance * ySegs),
    cloth = new Cloth(xSegs, ySegs),
    GRAVITY = 981 * 1.4,
    gravity = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar(MASS),
    TIMESTEP = 18 / 1000,
    TIMESTEP_SQ = TIMESTEP * TIMESTEP,
    pins = [],
    wind = true,
    windStrength = 2,
    windForce = new THREE.Vector3(0,0,0),
    tmpForce = new THREE.Vector3(),
    lastTime;

function plane(width, height) {

	return function(u, v) {
		var x = u * width;
		var y = v * height;
		var z = 0;

		return new THREE.Vector3(x, y, z);
	};
}


var diff = new THREE.Vector3();

function satisifyConstrains(p1, p2, distance) {
	diff.sub(p2.position, p1.position);
	var currentDist = diff.length();
	if (currentDist==0) return;
	var correction = diff.multiplyScalar(1 - distance/currentDist);
	var correctionHalf = correction.multiplyScalar(0.5);
	p1.position.addSelf(correctionHalf);
	p2.position.subSelf(correctionHalf);
}

function simulate(time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}
	
	var i, il, particles, particle, pt, constrains, constrain;

	if (wind) {
		var face, faces = clothGeometry.faces, normal;

		particles = cloth.particles;

		for (i=0,il=faces.length;i<il;i++) {
			face = faces[i];
			normal = face.normal;

			tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
			particles[face.a].addForce(tmpForce);
			particles[face.b].addForce(tmpForce);
			particles[face.c].addForce(tmpForce);
		}
	}
	
	for (particles = cloth.particles, i=0, il = particles.length
			;i<il;i++) {
		particle = particles[i];
		particle.addForce(gravity);
		particle.integrate(TIMESTEP_SQ);
	}

	constrains = cloth.constrains,
	il = constrains.length;
	for (i=0;i<il;i++) {
		constrain = constrains[i];
		satisifyConstrains(constrain[0], constrain[1], constrain[2]);
	}
	for (i=0, il=pins.length;i<il;i++) {
		var xy = pins[i];
		var p = particles[xy];
		p.position.copy(p.original);
		p.previous.copy(p.original);
	}
}