const sh = `#!/usr/bin/env bash

pm() {
	if command -v lexjs_pm &>/dev/null; then
		lexjs_pm "$@"

		# get command value
		local script_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
		local parent_dir="$(dirname "$script_dir")"
		local cmd_file="$parent_dir/tmp/cmd"

		if [ -f "$cmd_file" ]; then
			local cmd=$(<"$cmd_file")

			# clear temp files
			>"$cmd_file"

			# run the script
			if [ ! -z "$cmd" ]; then
				$cmd
			fi
		fi
	fi
}
`;

const ps1 = `#!/usr/bin/env pwsh

function pm {
	if (Get-Command "lexjs_pm" -ErrorAction SilentlyContinue) {
		& lexjs_pm @args

		# get command value
		$script_dir = Split-Path $PSCommandPath -Parent
		$parent_dir = Split-Path $script_dir -Parent
		$cmd_file = "$parent_dir\\tmp\\cmd"

		if (Test-Path -Path $cmd_file) {
			$cmd = Get-Content -Path $cmd_file -Raw
			Clear-Content -Path $cmd_file

			if (-not [string]::IsNullOrEmpty($cmd)) {
				Invoke-Expression $cmd
			}
		}
	}
}
`;

export const pm = { sh, ps1 };
