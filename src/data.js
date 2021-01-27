// prettier-ignore
const quadrants = {
  toolsAndSoftware: {
    quadrant: 0,
    rings: {
      expert: [
        "bash",
        "Cuckoo Sandbox",
        "git",
        "GitHub",
        "GitLab",
        "Makefiles",
        "tmux",
        "vim",
        "zsh",
      ],
      strong: [
        "Adobe Photoshop",
        "MediaWiki",
        "screen",
        "Sketch",
        "Unifi Controller",
      ],
      proficient: [
        "Adobe Illustrator",
        "Fish shell",
        "FreeCAD",
        "Inkscape",
      ],
    },
  },
  dataManagement: {
    quadrant: 1,
    rings: {
      expert: [
        "Beanstalk",
        "MySQL/MariaDB",
        "Systemd journal",
      ],
      strong: [
        "InfluxDB",
        "MongoDB",
        "PostgreSQL",
        "Redis",
      ],
      proficient: [
        "AWS S3",
        "Elasticsearch",
        "SwiftyBeaver",
      ],
    },
  },
  infrastructureAndHosting: {
    quadrant: 2,
    rings: {
      expert: [
        "BIND DNS",
        "CentOS",
        "Debian",
        "DigitalOcean Droplets",
        "Docker Compose",
        "GitLab CI",
        "Grafana",
        "Nagios",
        "Virtualbox",
        "VMWare",
      ],
      strong: [
        "AWS ECS",
        "Docker",
        "Drone CI",
        "Munin",
        "Nginx",
        "Puppet",
        "Telegraf",
        "Traefik",
        "Vagrant",
      ],
      proficient: [
        "Ansible",
        "Google App Engine",
        "Kibana",
        "Terraform",
      ],
    },
  },
  languagesAndFrameworks: {
    quadrant: 3,
    rings: {
      expert: [
        "Bash",
        "Flask",
        "HTML & CSS",
        "Jekyll",
        "LaTeX",
        "Mojolicious",
        "Perl",
        "Python",
        "Regular expressions",
      ],
      strong: [
        "canvas-sketch",
        "Django",
        "Express.js",
        "Go",
        "Java",
        "JavaScript",
        "Node.js",
        "OpenAPI (Swagger)",
        "Swift",
        "Vimscript",
        "Webpack",
      ],
      proficient: [
        "d3.js",
        "go-chi",
        "Objective-C",
        "P5.js",
        "ReactJS",
        "Ruby",
        "TypeScript",
      ],
    },
  },
};

const quadrantReducer = (acc, quadName) =>
  Object.keys(quadrants[quadName].rings).reduce(ringReducer(quadName), acc);

const ringReducer = (quadName) => (acc, ringName) =>
  acc.concat(
    quadrants[quadName].rings[ringName].map(entryMapper(quadName, ringName))
  );

const entryMapper = (quadName, ringName) => (label) => {
  const ringNumber = Object.keys(quadrants[quadName].rings).indexOf(ringName);
  const quadNumber = quadrants[quadName].quadrant;
  return {
    quadrant: quadNumber,
    ring: ringNumber,
    label,
  };
};

export default Object.keys(quadrants).reduce(quadrantReducer, []);
