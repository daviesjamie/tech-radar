// prettier-ignore
const quadrants = {
  toolsAndSoftware: {
    quadrant: 0,
    rings: {
      advanced: [
        "bash",
        "git",
        "Makefiles",
        "tmux",
        "vim",
        "zsh"
      ],
      intermediate: [
        "fzf",
        "Screen",
        "Sketch",
        "Systemd"
      ],
      beginner: [
        "Figma"
      ],
    },
  },
  dataManagement: {
    quadrant: 1,
    rings: {
      advanced: [
        "Beanstalk",
        "MySQL/MariaDB",
        "Systemd journal"
      ],
      intermediate: [
        "InfluxDB",
        "MongoDB",
        "PostgreSQL",
        "Redis"
      ],
      beginner: [
        "AWS S3",
        "Elasticsearch"
      ],
    },
  },
  infrastructureAndHosting: {
    quadrant: 2,
    rings: {
      advanced: [
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
      intermediate: [
        "AWS ECS",
        "Docker",
        "Drone CI",
        "Kibana",
        "Nginx",
        "Puppet",
        "Telegraf",
        "Traefik",
        "Vagrant",
      ],
      beginner: [
        "Ansible",
        "Terraform"
      ],
    },
  },
  languagesAndFrameworks: {
    quadrant: 3,
    rings: {
      advanced: [
        "Bash",
        "Flask",
        "HTML & CSS",
        "Jekyll",
        "LaTeX",
        "Mojolicious",
        "Perl",
        "Python",
        "Regular expressions",
        "SQL::Abstract",
      ],
      intermediate: [
        "d3.js",
        "Django",
        "Express",
        "Go",
        "Java",
        "JavaScript",
        "Node.js",
        "OpenAPI (Swagger)",
        "P5.js",
        "Swift",
        "Vimscript",
        "Webpack",
      ],
      beginner: [
        "Objective-C",
        "ReactJS",
        "Ruby",
        "TypeScript"
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
