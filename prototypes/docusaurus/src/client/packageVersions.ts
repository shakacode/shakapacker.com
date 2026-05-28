type Registry = 'npm' | 'rubygems';

type PackageVersionElement = HTMLElement & {
  dataset: {
    packageVersionRegistry?: Registry;
    packageVersionName?: string;
  };
};

const selector = '[data-package-version-registry][data-package-version-name]';
const versionCache = new Map<string, Promise<string>>();

function registryKey(registry: Registry, packageName: string): string {
  return `${registry}:${packageName}`;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Version request failed: ${response.status}`);
  }
  return response.json();
}

function npmPackageUrl(packageName: string): string {
  return `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
}

function rubyGemsPackageUrl(packageName: string): string {
  return `https://rubygems.org/api/v1/gems/${encodeURIComponent(packageName)}.json`;
}

async function fetchPackageVersion(registry: Registry, packageName: string): Promise<string> {
  if (registry === 'npm') {
    const data = (await fetchJson(npmPackageUrl(packageName))) as {
      'dist-tags'?: {
        latest?: string;
      };
    };
    const version = data['dist-tags']?.latest;
    if (!version) {
      throw new Error(`No latest npm version for ${packageName}`);
    }
    return version;
  }

  const data = (await fetchJson(rubyGemsPackageUrl(packageName))) as {
    version?: string;
  };
  if (!data.version) {
    throw new Error(`No RubyGems version for ${packageName}`);
  }
  return data.version;
}

function currentVersion(registry: Registry, packageName: string): Promise<string> {
  const key = registryKey(registry, packageName);
  if (!versionCache.has(key)) {
    versionCache.set(key, fetchPackageVersion(registry, packageName));
  }
  return versionCache.get(key)!;
}

function getVersionOutput(element: PackageVersionElement): HTMLElement {
  if (element.hasAttribute('data-package-version-output')) {
    return element;
  }

  const existing = element.querySelector<HTMLElement>('[data-package-version-output]');
  if (existing) {
    return existing;
  }

  const output = document.createElement('span');
  output.className = 'package-version-inline';
  output.dataset.packageVersionOutput = '';
  element.append(' ', output);
  return output;
}

async function applyPackageVersion(element: PackageVersionElement): Promise<void> {
  const registry = element.dataset.packageVersionRegistry;
  const packageName = element.dataset.packageVersionName;
  if (!registry || !packageName) {
    return;
  }

  const output = getVersionOutput(element);
  output.textContent = 'loading version';

  try {
    const version = await currentVersion(registry, packageName);
    output.textContent = `v${version}`;
    element.setAttribute('aria-label', `${element.textContent?.trim() ?? packageName} current version ${version}`);
  } catch {
    output.textContent = 'version unavailable';
  }
}

export function onRouteDidUpdate(): void {
  document
    .querySelectorAll<PackageVersionElement>(selector)
    .forEach((element) => void applyPackageVersion(element));
}
