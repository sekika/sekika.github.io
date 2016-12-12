# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "sawyer"
  s.version = "0.8.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.5") if s.respond_to? :required_rubygems_version=
  s.authors = ["Rick Olson", "Wynn Netherland"]
  s.date = "2016-11-07"
  s.email = "technoweenie@gmail.com"
  s.homepage = "https://github.com/lostisland/sawyer"
  s.licenses = ["MIT"]
  s.require_paths = ["lib"]
  s.rubygems_version = "2.0.14.1"
  s.summary = "Secret User Agent of HTTP"

  if s.respond_to? :specification_version then
    s.specification_version = 2

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<faraday>, ["< 0.10", "~> 0.8"])
      s.add_runtime_dependency(%q<addressable>, ["< 2.6", ">= 2.3.5"])
    else
      s.add_dependency(%q<faraday>, ["< 0.10", "~> 0.8"])
      s.add_dependency(%q<addressable>, ["< 2.6", ">= 2.3.5"])
    end
  else
    s.add_dependency(%q<faraday>, ["< 0.10", "~> 0.8"])
    s.add_dependency(%q<addressable>, ["< 2.6", ">= 2.3.5"])
  end
end
