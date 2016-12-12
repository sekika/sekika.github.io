# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "classifier-reborn"
  s.version = "2.0.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Lucas Carlson", "Parker Moore", "Chase Gilliam"]
  s.date = "2015-10-31"
  s.email = ["lucas@rufy.com", "parkrmoore@gmail.com", "chase.gilliam@gmail.com"]
  s.executables = ["bayes.rb", "summarize.rb"]
  s.extra_rdoc_files = ["README.markdown", "LICENSE"]
  s.files = ["bin/bayes.rb", "bin/summarize.rb", "README.markdown", "LICENSE"]
  s.homepage = "https://github.com/jekyll/classifier-reborn"
  s.licenses = ["LGPL"]
  s.rdoc_options = ["--charset=UTF-8"]
  s.require_paths = ["lib"]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.3")
  s.rubygems_version = "2.0.14.1"
  s.summary = "A general classifier module to allow Bayesian and other types of classifications."

  if s.respond_to? :specification_version then
    s.specification_version = 2

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<fast-stemmer>, ["~> 1.0"])
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_development_dependency(%q<rdoc>, [">= 0"])
      s.add_development_dependency(%q<test-unit>, [">= 0"])
    else
      s.add_dependency(%q<fast-stemmer>, ["~> 1.0"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<rdoc>, [">= 0"])
      s.add_dependency(%q<test-unit>, [">= 0"])
    end
  else
    s.add_dependency(%q<fast-stemmer>, ["~> 1.0"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<rdoc>, [">= 0"])
    s.add_dependency(%q<test-unit>, [">= 0"])
  end
end
