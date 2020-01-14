<template>
    <footer id="footer">
        <div class="left-align footer--copyright"><p>© 2020 {{ $t("app_name") }}</p></div>
        
        <div class="container-social right-align right-align">
            <ul class="list-unstyled">
            <li>
                <a
                href="https://github.com/bc66/lucky-airdrop/"
                rel="noopener noreferrer"
                target="_blank"
                >GitHub</a>
            </li>
            </ul>
        </div>
    </footer>
</template>


<script>
export default {
  name: "Footer"
}
</script>