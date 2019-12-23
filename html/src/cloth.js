class Cloth {
    constructor(w, h) {
        w = w || 10;
        h = h || 10;
        this.w = w;
        this.h = h;

        var particles = [];
        var constrains = [];

        var u, v;

        for (v=0;v<=h;v++) {
            for (u=0;u<=w;u++) {
                particles.push(
                    new Particle(u/w, v/h, 0, MASS)
                );
            }
        }
        
        for (v=0;v<h;v++) {
            for (u=0;u<w;u++) {

                constrains.push([
                    particles[index(u, v)],
                    particles[index(u, v+1)],
                    restDistance
                ]);

                constrains.push([
                    particles[index(u, v)],
                    particles[index(u+1, v)],
                    restDistance
                ]);

            }
        }

        for (u=w, v=0;v<h;v++) {
            constrains.push([
                particles[index(u, v)],
                particles[index(u, v+1)],
                restDistance

            ]);
        }

        for (v=h, u=0;u<w;u++) {
            constrains.push([
                particles[index(u, v)],
                particles[index(u+1, v)],
                restDistance
            ]);
        }

        var diagonalDist = Math.sqrt(restDistance * restDistance * 2);

        for (v=0;v<h;v++) {
            for (u=0;u<w;u++) {

                constrains.push([
                    particles[index(u, v)],
                    particles[index(u+1, v+1)],
                    diagonalDist
                ]);

                constrains.push([
                    particles[index(u+1, v)],
                    particles[index(u, v+1)],
                    diagonalDist
                ]);

            }
        }

        this.particles = particles;
        this.constrains = constrains;

        function index(u, v) {
            return u + v * (w + 1);
        }

        this.index = index;

    }
}