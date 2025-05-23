techTerms = [
  "Axiomatic",
  "Baryogenesis",
  "Cryogenic",
  "Dendritic",
  "Echolocation",
  "Fibonacci",
  "Gaussianization",
  "Heterogeneous",
  "Infrasound",
  "Joule-Thomson",
  "Kolmogorov-Smirnov",
  "Lagrangian",
  "Magneticum",
  "Nanosecond",
  "Olfactory",
  "Pseudospectral",
  "Quadrature",
  "Reynoldsnumber",
  "Spectrophotometry",
  "Tessellation",
  "Ultracapacitor",
  "Vortex dynamics",
  "Wigner-Seitz cell",
  "X-ray computed tomography",
  "Yttrium-based superconductor",
  "Zeta function regularization",
  "Aberration correction",
  "Acoustic holography",
  "Adiabatic theorem",
  "Aerodynamics of flapping wings",
  "Algorithmic game theory",
  "Alpha-helix conformation",
  "Amplifier noise figure",
  "Anisotropic superconductivity",
  "Antimatter annihilation",
  "Aperture synthesis imaging",
  "Artificial general intelligence",
  "Atomic clock precision",
  "Avalanche photodiode gain",
  "Axial flow compressor design",
  "Bessel function approximation",
  "Biological neural networks",
  "Black hole information paradox",
  "Blind source separation algorithms",
  "Boolean satisfiability problem",
  "Boundary layer turbulence modeling",
  "Brain-computer interface protocols",
  "Cascading failure analysis",
  "Causal loop detection methods",
  "Cellular automata simulations",
  "Chaotic dynamics of complex systems",
  "Charge carrier mobility measurement",
  "Chromatic dispersion compensation",
  "Classical field theory formulations",
  "Clustering algorithms for categorical data",
  "Coherent quantum computing protocols",
  "Collaborative filtering recommendations",
  "Combinatorial optimization techniques",
  "Communication complexity theory",
  "Computational fluid dynamics simulations",
  "Conjugate gradient methods in linear algebra",
  "Consensus-based distributed control systems",
  "Continuous-time signal processing algorithms",
  "Control system stability analysis",
  "Convolutional neural networks for image recognition",
  "Cryogenic superconducting materials synthesis",
  "Cryptanalysis of public-key encryption schemes",
  "Crystal structure prediction methods",
  "Cybersecurity threat modeling and mitigation strategies",
"Data assimilation methods for climate modeling",
"Distributed ledger technology consensus algorithms",
"DNA sequencing error correction techniques",
"Dynamic programming solutions for NP-complete problems",
"Echo state networks for time series forecasting",
"Elasticity of demand in microeconomics",
"Electromagnetic compatibility testing protocols",
"Elementary particle interactions at the Large Hadron Collider",
"Embedded systems design with reconfigurable logic",
"Energy storage system sizing and optimization methods",
"Entropy-based anomaly detection algorithms for IoT data",
"Environmental impact assessment methodologies",
"Epigenetic regulation of gene expression mechanisms",
"Error-correcting codes for quantum computing",
"Evolutionary game theory models in biology",
"Exascale supercomputing architectures",
"Expert systems for decision support and diagnosis",
"Experimental design methods for materials science research",
"Federated learning protocols for decentralized data sharing",
"Finite element method simulations for structural analysis",
"First-order logic formalizations of mathematical theories",
"Flavor physics at the Large Hadron Collider",
"Fractal geometry in image processing and compression",
"Frequency domain filtering algorithms for signal processing",
"Fuzzy control systems for process automation",
"Gaussian process regression models for machine learning",
"Geographic information systems (GIS) data analysis techniques",
"Genomic sequence alignment algorithms",
"Geometric algebra formulations in computer graphics",
"Graph theory applications to social network analysis",
"Gravitational wave astronomy detection methods",
"Group theory representations in particle physics",
"Holographic principle interpretations of quantum gravity",
"Hybrid Monte Carlo simulations for molecular dynamics",
"Hyperbolic geometry in computer vision and robotics",
"Illumination-invariant object recognition algorithms",
"Image segmentation techniques using active contours",
"Information-theoretic approaches to machine learning",
"Innovative materials synthesis methods using 3D printing",
"Integer programming formulations for optimization problems",
"Interference alignment in wireless communication systems",
"Interval arithmetic for robust numerical computations",
"Inverse scattering transform algorithms for signal processing",
"Ion implantation techniques for semiconductor manufacturing",
"Ising model simulations of magnetic materials behavior",
"Kolmogorov complexity theory in computer science",
"Kernel methods for machine learning and pattern recognition",
"Kinetic Monte Carlo simulations for materials science",
"Knapsack problem formulations for optimization algorithms",
"Lagrangian mechanics applications to robotics and control systems",
"Large-scale linear regression models for data analysis",
"Latent Dirichlet allocation (LDA) topic modeling techniques",
"Linear programming relaxations for integer programs",
"Local search methods in combinatorial optimization",
"Logic-based expert systems for decision support",
"Long-range dependent processes in finance and economics",
"Machine learning algorithms for recommender systems",
"Magnetic resonance imaging (MRI) reconstruction techniques",
"Many-body localization theory in condensed matter physics",
"Markov chain Monte Carlo methods for Bayesian inference",
"Maximum likelihood estimation in statistics and machine learning",
"Nanotechnology applications to biomedical devices",
"Natural language processing (NLP) techniques for text analysis",
"Neural networks with spiking neurons in artificial intelligence",
"Nonlinear dynamics and chaos theory in physics and engineering",
"Numerical methods for solving partial differential equations",
"Object-oriented programming languages for software development",
"Optimization algorithms for resource allocation problems",
"Orbital mechanics applications to space mission planning",
"Particle swarm optimization techniques for global optimization",
"Pattern recognition using machine learning and data mining",
"Percolation theory in statistical physics and materials science",
"Quantum computing and quantum information theory",
"Queueing theory applications to communication networks",
"Random matrix theory in statistical physics and finance",
"Reinforcement learning algorithms for decision-making systems",
"Relational databases and data modeling techniques",
"Renewable energy systems and sustainable development",
"Reservoir computing methods for time-series forecasting",
"Riemannian geometry applications to computer vision and robotics",
"Robust control theory in control engineering and aerospace",
"Satisfiability problem (SAT) formulations for Boolean satisfiability",
"Scalable algorithms for big data analytics and machine learning",
"Self-organizing maps in artificial intelligence and pattern recognition",
"Sensor networks and wireless sensor systems",
"Service-oriented architecture (SOA) design principles",
"Signal processing techniques for image and audio analysis",
"Social network analysis using graph theory and statistics",
"Software engineering methodologies for large-scale software development",  
"Tensor networks and tensor contractions in quantum computing",
"Time-series forecasting using machine learning algorithms",
"Topological insulators and topological phases in condensed matter physics",
"Traffic flow modeling and simulation techniques for transportation engineering",
"Transfer learning methods for deep neural networks",
"Tree-based models for decision-making systems",
"Trust region optimization methods for non-convex optimization problems",
"Unsupervised learning algorithms for clustering and dimensionality reduction",
"Vector space models in natural language processing and information retrieval",
"VLSI design and verification techniques for digital circuits",
"Wavelet analysis and compression methods for image and audio signals",
"Weakly supervised learning methods for semi-supervised classification",
"Web scraping and data extraction algorithms for web-based data mining",
"XGBoost algorithm for gradient boosting and decision trees",
"Yoga in computer science: a study on the intersection of yoga and programming",
"Zero-shot learning methods for classifying unseen data without training",
"Zigzag patterns in machine learning: an exploration of zigzag-based algorithms"
]


function drawParticles(p5){
    // console.log(particles[0].pos)
    p5.push()
    p5.textSize(36);
    p5.translate(-width/2, -height -100 )
    for (let i = 0; i < p5.particles.length; i++) {
        let part = p5.particles[i];
        part.update();
        part.display();
    
        if (part.lifespan <= 0) {
          p5.particles.splice(i, 1);
          i--;
        }
      }
    p5.pop()
      
}

function initTextParts(p5, font){
  p5.textconfig = {}
  // p5.myFont = p5.loadFont('/PressStart2P-Regular.otf');
  p5.myFont = font
  p5.textFont(p5.myFont);
  p5.particles = [];
  p5.textconfig.render = true ;
  p5.textconfig.f = 0;
}


class Particle {
    constructor(x, y, z, txt, p) {
      this.p5 = p
      this.txt = txt
      this.pos = this.p5.createVector(x, y, z);
    //   this.vel = this.p5.createVector(this.p5.random(-10, 10), this.p5.random(2, 4),  this.p5.random(2, 4));
      this.vel = this.p5.createVector(this.p5.random(-8, -4), 0, 0);
      this.lifespan = 255;
    }
  
    update() {
      this.pos.add(this.vel);
      if (this.pos.x < 10){
        this.lifespan -= 5;
      }
    }
  
    display() {
    //   console.log("drawing pat")
      if (this.p5.textconfig.render) {
        // this.p5.stroke(255, this.lifespan);
        this.p5.fill(255, this.lifespan / 2);
        this.p5.push()
        this.p5.translate(this.pos.x, this.pos.y, this.pos.z)
        // this.p5.box(20)
        // this.p5.ellipse(0, 0, 16, 16);
        this.p5.text(this.txt,0,0)
        this.p5.pop()
      }
    }
  }



function updateParticles(p5) {
  if (p5.particles.length < 50){
    // Add new particles
      for (let i = 0; i < 2; i++) {
        p5.textconfig.f++;
        let x = width;
        let y = (p5.textconfig.f%50)*36;
        let z = 0-(p5.textconfig.f%50)*y/144;
        if (p5.textconfig.f%50 < 25) {
        	z = (p5.textconfig.f%50)*36;
        }
        let txt = techTerms[Math.floor(Math.random() * techTerms.length)];
        // let txt = techTerms[0];
        let part = new Particle(x, y, z, txt, p5);
        p5.particles.push(part);
      }
    }
}


  
// 	p5.push();
//     for (var i = 0; i < techTerms.length; i++) {
// //       p5.text(techTerms[i], 10, 20*i);
// 	}
// // 	p5.rotateX(p5.frameCount * 0.1 );
// //   	p5.translate(0,p5.frameCount%height )
// // 	p5.rotateY(p5.frameCount * 0.01 );
// // 	p5.rotateZ(p5.frameCount * 0.031 );
// // 	p5.box(300)
// //     p5.fill('#ED225D');
  
  	