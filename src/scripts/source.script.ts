const sh = `#!/usr/bin/env bash

for file in "$(dirname "$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)")"/bin/*.sh; do
	if [ -f "$file" ]; then
		source "$file"
	fi
done
`;

const ps1 = `#!/usr/bin/env pwsh

$script_dir = Split-Path -Parent $PSCommandPath
$parent_dir = Split-Path -Parent $script_dir

Get-ChildItem -Path "$parent_dir/bin" -Filter *.ps1 | ForEach-Object {
	. $_.FullName
}`;

export const source = { sh, ps1 };
